import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
const dynamodb = new DynamoDB();

export async function getAll() {
  try {
    const result = await dynamodb.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: 'PET' },
        },
      })
    );
    const items = result.Items?.map((pet) => unmarshall(pet));
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: items,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : error,
      }),
    };
  }
}
