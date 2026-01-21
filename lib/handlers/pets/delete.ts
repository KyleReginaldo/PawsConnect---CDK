import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const dynamodb = new DynamoDB();
export async function deletePet({ id }: { id: string }) {
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing id parameter' }),
    };
  }
  await dynamodb.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        pk: `PET#${id}`,
        sk: 'PROFILE',
      },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Pet deleted', id: id }),
  };
}
