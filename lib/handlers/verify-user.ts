import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import z from 'zod';

const client = new CognitoIdentityProviderClient({});

const VerifyUserSchema = z.object({
  email: z.email(),
  code: z.string().length(6),
});
export const handler = async (event: any) => {
  try {
    const bodyParsed = VerifyUserSchema.parse(JSON.parse(event.body));
    if (!bodyParsed) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request body' }),
      };
    }
    const { email, code } = bodyParsed;

    await client.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.CLIENT_ID!,
        Username: email,
        ConfirmationCode: code,
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User verified successfully' }),
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
