import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { z } from 'zod';
const client = new CognitoIdentityProviderClient({});
const dynamodb = new DynamoDB();
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
    const result = await client.send(
      new SignUpCommand({
        ClientId: process.env.CLIENT_ID!,
        Username: email,
        Password: password,
      })
    );
    if (result.UserSub) {
      await dynamodb.send(
        new PutItemCommand({
          TableName: process.env.TABLE_NAME!,
          Item: {
            pk: { S: `USER#${result.UserSub}` },
            sk: { S: `PROFILE` },
            GSI1PK: { S: `USER` },
            GSI1SK: { S: `CREATED_AT#${new Date().toISOString()}` },
            createdAt: { S: new Date().toISOString() },
            email: { S: email },
            confirmed: { BOOL: false },
          },
        })
      );
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'User registration failed' }),
      };
    }
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
