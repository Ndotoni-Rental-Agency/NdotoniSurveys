import { Amplify } from 'aws-amplify';
import type { ResourcesConfig } from 'aws-amplify';

// Points at the same Cognito user pool + AppSync API as the main ndotoni-web
// app. Surveys has no backend of its own — it reuses that one.
const getConfig = (): ResourcesConfig => {
  const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-west-2_0DZJBusjf';
  const userPoolClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '4k6u174tgu4glhi814ulihckh4';
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'rental-app-dev-055929692194.auth.us-west-2.amazoncognito.com';
  const redirectSignIn = process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/login';
  const redirectSignOut = process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/login';
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/graphql';
  const graphqlRegion = process.env.NEXT_PUBLIC_GRAPHQL_REGION || 'us-west-2';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'da2-4kqoqw7d2jbndbilqiqpkypsve';

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
