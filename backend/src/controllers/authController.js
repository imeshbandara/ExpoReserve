import { prisma } from '../config/db.js';
import { getOIDCConfig } from '../config/oidc.js';
import * as client from 'openid-client';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE_NAME = 'session_token';
const OIDC_STATE_COOKIE = 'oidc_state';

const getJwtCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const getOidcCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 10 * 60 * 1000, // 10 minutes for auth flow
});

// Start OIDC Flow
export const login = async (req, res, next) => {
  try {
    const config = await getOIDCConfig();
    
    const state = client.randomState();
    const nonce = client.randomNonce();
    const code_verifier = client.randomPKCECodeVerifier();
    const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);

    // Build authorization URL
    const parameters = {
      redirect_uri: process.env.OIDC_REDIRECT_URI,
      scope: 'openid email profile',
    };
    
    const redirectTo = client.buildAuthorizationUrl(config, {
      ...parameters,
      state,
      nonce,
      code_challenge,
      code_challenge_method: 'S256',
    });

    // Store state, nonce, and code_verifier in a cookie for the callback
    const cookieData = JSON.stringify({ state, nonce, code_verifier });
    res.cookie(OIDC_STATE_COOKIE, cookieData, getOidcCookieOptions());

    res.status(200).json({ url: redirectTo.href });
  } catch (error) {
    next(error);
  }
};

// Handle OIDC Callback
export const callback = async (req, res, next) => {
  try {
    const config = await getOIDCConfig();
    
    // Read the stored state from the cookie
    const stateCookie = req.cookies[OIDC_STATE_COOKIE];
    if (!stateCookie) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
    
    const { state, nonce, code_verifier } = JSON.parse(stateCookie);
    res.clearCookie(OIDC_STATE_COOKIE);

    // Use full URL to parse the callback
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const currentUrl = new URL(req.url, backendUrl);

    const tokens = await client.authorizationCodeGrant(
      config,
      currentUrl,
      {
        pkceCodeVerifier: code_verifier,
        expectedState: state,
        expectedNonce: nonce,
      }
    );

    const claims = tokens.claims(); // ID Token claims
    
    // Find or create user
    const email = claims.email;
    const oidc_sub = claims.sub;
    const name = claims.name || claims.preferred_username || email.split('@')[0];

    const user = await prisma.user.upsert({
      where: { oidc_sub },
      update: {
        email,
        name,
      },
      create: {
        oidc_sub,
        username: oidc_sub, 
        email,
        name,
      }
    });

    // We generate our own application JWT for session management
    const sessionToken = jwt.sign(
      { userId: user.id },
      process.env.SESSION_SECRET || 'fallback_session_secret',
      { expiresIn: '7d' }
    );

    res.cookie(SESSION_COOKIE_NAME, sessionToken, getJwtCookieOptions());
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  } catch (error) {
    console.error('OIDC Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

// Get Current User
export const getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

// Logout
export const logout = async (req, res, next) => {
  try {
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
