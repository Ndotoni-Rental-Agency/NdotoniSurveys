# Ndotoni Surveys

Standalone frontend for the internal peer-review survey tool, extracted out
of the admin dashboard in `ndotoniWeb`. Deploys independently to
**surveys.ndotoni.com**.

## Backend

This app has no backend of its own — it talks to the **same** AWS Cognito
user pool and AppSync GraphQL API as `ndotoniWeb`. Copy `.env.example` to
`.env.local` and fill in real values for the stage you're targeting.

Pull the current values straight from CloudFormation (needs an AWS CLI
profile for that stage, e.g. `beta`):

```bash
aws cloudformation describe-stacks --stack-name RentalApp-Auth-beta \
  --region us-west-2 --profile beta --query 'Stacks[0].Outputs'
aws cloudformation describe-stacks --stack-name RentalApp-Service-beta \
  --region us-west-2 --profile beta --query 'Stacks[0].Outputs'
```

Use the **`WebClientId`** output as `NEXT_PUBLIC_USER_POOL_CLIENT_ID` — it's
the app client with Google/Facebook/Apple identity providers enabled. The
legacy `UserPoolClientId` output does not have social login configured.

## Access

Every route requires a signed-in **ADMIN** user (checked both by
`AuthGuard` client-side and by the `AuthContext` sign-in/OAuth-callback
flow, which signs non-admins back out immediately). There is no self-serve
sign-up here — admin accounts are created through the main app/backend.

Sign-in supports email/password and **Google** (via the Cognito Hosted UI).
Google redirects through `/auth/callback`.

## Development

```bash
pnpm install
pnpm dev   # runs on :3001, not :3000 — see below
```

Dev runs on port **3001**, not 3000, because that's the port already
whitelisted as an OAuth callback/logout URL on the shared Cognito app
client (`http://localhost:3001/auth/callback`) — this lets Google sign-in
work locally without needing infra changes, and avoids clashing with
`ndotoniWeb`'s own dev server on :3000.

## Deployment

Deploy as its own Vercel project (not part of the `ndotoniWeb` project):

1. `vercel link` a **new** Vercel project for this repo.
2. Set the environment variables from `.env.example` (Cognito + AppSync,
   real stage values — see above) in that Vercel project.
3. Point the custom domain `surveys.ndotoni.com` at it.

### Google sign-in in production

`https://surveys.ndotoni.com/auth/callback` and `https://surveys.ndotoni.com`
must be registered as allowed callback/logout URLs on the Cognito app
client before Google sign-in works on the real domain. That's a backend
change — see `ndotoniBackend/packages/cdk/lib/stacks/auth-stack.ts`
(`webCallbackUrls` / `webLogoutUrls`), which already has `surveys.ndotoni.com`
added; it needs `cdk deploy RentalApp-Auth-<stage>` to take effect.
