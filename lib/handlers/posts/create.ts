import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { z } from 'zod';
const dynamodb = new DynamoDB();

export const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  publicationDate: z.string(),
  userId: z.string().regex(/^[a-zA-Z0-9-]+$/),
});
export async function create(body: string | null) {
  const uuid = randomUUID();

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing request body',
      }),
    };
  }

  const bodyParsed = PostSchema.parse(JSON.parse(body));
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `USER#${bodyParsed.userId}`,
        sk: `POST#${uuid}`,
        GSI1PK: `POST`,
        GSI1SK: `CREATED_AT#${new Date().toISOString()}`,
        createdAt: new Date().toISOString(),
        title: bodyParsed.title,
        description: bodyParsed.description,
        publicationDate: bodyParsed.publicationDate,
      },
    })
  );
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Post created',
      id: uuid,
    }),
  };
}
