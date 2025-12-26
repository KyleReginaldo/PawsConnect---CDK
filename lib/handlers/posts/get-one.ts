import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

const dynamodb = new DynamoDB();
export async function getOne({ id, userId }: { id: string; userId: string }) {
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing id parameter' }),
    };
  }
  const result = await dynamodb.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        pk: `USER#${userId}`,
        sk: `POST#${id}`,
      },
    })
  );
  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Post not found' }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: result.Item,
    }),
  };
}
