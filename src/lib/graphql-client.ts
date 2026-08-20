import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

let client: any = null;

function getClient(): any {
  if (!client) {
    if (typeof window !== 'undefined') {
      require('@/lib/amplify');
    }
    client = generateClient() as any;
  }
  return client as any;
}

/**
 * Centralized GraphQL client. Every survey page is admin-only, so in
 * practice only `executeAuthenticated` is used, but `executePublic` is kept
 * for parity with the main app's client shape.
 */
export class GraphQLClient {
  static async executeAuthenticated<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      const clientInstance = getClient();
      await getCurrentUser();

      const result = (await clientInstance.graphql({
        query,
        variables,
        authMode: 'userPool',
      })) as GraphQLResult<any>;

      return result.data as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'UserUnAuthenticatedError') {
        throw new Error('Authentication required for this operation');
      }
      throw error;
    }
  }

  static async executePublic<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const clientInstance = getClient();

    const result = (await clientInstance.graphql({
      query,
      variables,
      authMode: 'apiKey',
    })) as GraphQLResult<any>;

    return result.data as T;
  }

  static getRawClient() {
    return getClient();
  }
}

export default GraphQLClient;
