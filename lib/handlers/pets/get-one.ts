import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

const dynamodb = new DynamoDB();
export async function getOne({ id }: { id: string }) {
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
        pk: `PET#${id}`,
        sk: 'PROFILE',
      },
    })
  );
  if (!result.Item) {
    return {
      StatusCode: 404,
      body: JSON.stringify({ message: 'Pet not found' }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result.Item,
      }),
    };
  }
}
