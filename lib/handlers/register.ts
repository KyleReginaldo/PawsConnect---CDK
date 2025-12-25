import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { z } from 'zod';
const client = new CognitoIdentityProviderClient({});
export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const handler = async (event: any) => {
  try {
    const bodyParsed = RegisterSchema.parse(JSON.parse(event.body));
    if (!bodyParsed) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request body' }),
      };
    }
    const { email, password } = bodyParsed;
    await client.send(
      new SignUpCommand({
        ClientId: process.env.CLIENT_ID!,
        Username: email,
        Password: password,
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully' }),
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
