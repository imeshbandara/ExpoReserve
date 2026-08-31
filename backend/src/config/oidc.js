import * as client from 'openid-client';
import dotenv from 'dotenv';
dotenv.config();

let oidcConfig = null;

export async function getOIDCConfig() {
  if (oidcConfig) return oidcConfig;
  
  if (!process.env.OIDC_ISSUER_URL || !process.env.OIDC_CLIENT_ID) {
    throw new Error('OIDC environment variables are not configured.');
  }

  const server = new URL(process.env.OIDC_ISSUER_URL);
  
  oidcConfig = await client.discovery(
    server,
    process.env.OIDC_CLIENT_ID,
    process.env.OIDC_CLIENT_SECRET
  );

  return oidcConfig;
}
