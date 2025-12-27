import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dynamodb = new DynamoDB();

export async function getAll() {
  const result = await dynamodb.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  const items = result.Items?.map((item) => unmarshall(item));
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: items,
    }),
  };
}
