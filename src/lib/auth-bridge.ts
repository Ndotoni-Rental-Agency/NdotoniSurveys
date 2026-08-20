/**
 * Authentication Bridge — trimmed down from the main ndotoni-web app.
 * Surveys is admin-only and has no self-serve sign-up, so only the Cognito
 * email/password path and Google (via Hosted UI redirect) are kept.
 */

import { GraphQLClient } from '@/lib/graphql-client';
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  signInWithRedirect,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';
import { getMe } from '@/graphql/queries';

export class AuthBridge {
  /**
   * Sign in using Amplify Cognito, then fetch the user profile from the
   * shared backend.
   */
  static async signInWithAmplify(email: string, password: string) {
    const signInResult = await cognitoSignIn({ username: email, password });

    if (!signInResult.isSignedIn) {
      const nextStep = signInResult.nextStep;
      const error: any = new Error(
        nextStep?.signInStep
          ? `Sign in requires additional step: ${nextStep.signInStep}`
          : 'Sign in was not successful. Please check your credentials.'
      );

      if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        error.name = 'UserNotConfirmedException';
        error.message = 'User is not confirmed. Please verify your email.';
      } else {
        error.name = 'SignInIncompleteException';
      }
      error.nextStep = nextStep;
      throw error;
    }

    const data = await GraphQLClient.executeAuthenticated<{ getMe: any }>(getMe);

    if (!data.getMe) {
      throw new Error('User profile not found');
    }

    return { user: data.getMe };
  }

  /**
   * Sign in with Google using the Cognito Hosted UI. Redirects the browser
   * away — the result is picked up on return at /auth/callback.
   */
  static async signInWithGoogle() {
    await signInWithRedirect({ provider: 'Google' });
  }

  /**
   * Wait for Amplify to finish processing the OAuth redirect callback.
   */
  static async waitForOAuthSession(maxMs = 8000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.accessToken) return true;
      } catch {
        // Amplify may still be exchanging the code
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return false;
  }

  static async signOutFromBridge() {
    try {
      await cognitoSignOut();
    } catch {
      // Silent fail
    }
  }

  static async hasCognitoSession(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Force-verify the session against Cognito (refreshing tokens if needed).
   * Detects a refresh token Cognito will no longer honor before we act on a
   * transient error.
   */
  static async hasValidSession(): Promise<boolean> {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      return !!session.tokens?.accessToken;
    } catch {
      return false;
    }
  }

  static async getUserId(): Promise<string | undefined> {
    try {
      const currentUser = await getCurrentUser();
      return currentUser.userId;
    } catch {
      return undefined;
    }
  }
}
