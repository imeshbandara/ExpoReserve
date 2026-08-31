# ExpoReserve
ExpoReserve is a secure stall reservation portal for exhibition vendors and organizers.  Role-Based Access: Vendors book custom stalls and track requests; organizers manage venue allocations.  Enterprise Security: Cloud IdP login via OIDC/SAML, token-based authorization, and OWASP Top 10 hardened defenses.

# Secure Stall Reservation Platform

## Overview
A secure web application for stall vendors to reserve stalls and for exhibition organizers to manage reservations.

## Architecture
- **Backend**: Express.js + PostgreSQL + Prisma ORM
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Authentication**: OIDC/SAML
- **Security**: OWASP Top 10 compliance

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- OIDC Provider (Asgardeo/Auth0/Okta)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your OIDC credentials and DB connection
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL and OIDC config
npm run dev
```

## OWASP Compliance
- [x] Broken Authentication (OIDC/SAML)
- [x] CSRF Protection (SameSite cookies)
- [x] XSS Protection (React escaping + CSP)
- [x] SQL Injection (Prisma ORM)
- [x] Sensitive Data Exposure (HTTPS)
- [x] Broken Access Control (Token validation)
- [x] Security Misconfiguration (Environment variables)
- [x] Insecure Deserialization (No serialization)
- [x] Vulnerable Dependencies (npm audit)
- [x] Insufficient Logging (Audit logs)

## Deployment
- [Add deployment instructions]

## Contributing
[Add contribution guidelines]

## License
[Add license]