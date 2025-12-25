import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { z } from 'zod';

const client = new CognitoIdentityProviderClient({});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export const handler = async (event: any) => {
  try {
    const bodyParsed = LoginSchema.parse(JSON.parse(event.body));
    if (!bodyParsed) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request body' }),
      };
    }
    const { email, password } = bodyParsed;

    const result = await client.send(
      new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.CLIENT_ID!,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: result.AuthenticationResult?.AccessToken,
        idToken: result.AuthenticationResult?.IdToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : error,
      }),
    };
  }
};
