# Ndotoni Surveys

Standalone frontend for the internal peer-review survey tool, extracted out
of the admin dashboard in `ndotoniWeb`. Deploys independently to
**surveys.ndotoni.com**.

## Backend

This app has no backend of its own — it talks to the **same** AWS Cognito
user pool and AppSync GraphQL API as `ndotoniWeb`. Copy `.env.example` to
`.env.local` and fill in the same Cognito/AppSync values used by the main
app (see `ndotoniWeb/.env.example`).

## Access

Every route requires a signed-in **ADMIN** user (checked both by
`AuthGuard` client-side and by the `AuthContext` sign-in flow, which signs
non-admins back out immediately). There is no self-serve sign-up here —
admin accounts are created through the main app/backend.

## Development

```bash
pnpm install
pnpm dev
```

## Deployment

Deploy as its own Vercel project (not part of the `ndotoniWeb` project):

1. `vercel link` a **new** Vercel project for this repo.
2. Set the environment variables from `.env.example` (Cognito + AppSync,
   same values as `ndotoniWeb`'s production env) in that Vercel project.
3. Point the custom domain `surveys.ndotoni.com` at it.
