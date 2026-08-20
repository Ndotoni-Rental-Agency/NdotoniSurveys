import { Amplify } from 'aws-amplify';
import type { ResourcesConfig } from 'aws-amplify';

// Points at the same Cognito user pool + AppSync API as the main ndotoni-web
// app. Surveys has no backend of its own — it reuses that one. There are no
// hardcoded fallback credentials here on purpose — set real values via
// .env.local (see .env.example) or the deployment's environment variables.
// The user pool client must be the WEB app client (the one with
// Google/Facebook/Apple identity providers enabled), not the legacy client.
const getConfig = (): ResourcesConfig => {
  const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID || '';
  const userPoolClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '';
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '';
  const redirectSignIn = process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3001/auth/callback';
  const redirectSignOut = process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3001';
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '';
  const graphqlRegion = process.env.NEXT_PUBLIC_GRAPHQL_REGION || 'us-west-2';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

  return {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          oauth: {
            domain: cognitoDomain,
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: [redirectSignIn],
            redirectSignOut: [redirectSignOut],
            responseType: 'code',
          },
        },
      },
    },
    API: {
      GraphQL: {
        endpoint: graphqlEndpoint,
        region: graphqlRegion,
        defaultAuthMode: 'apiKey' as const,
        apiKey,
      },
    },
  };
};

Amplify.configure(getConfig());

export default Amplify;
