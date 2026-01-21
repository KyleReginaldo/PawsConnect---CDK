import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
const dynamodb = new DynamoDB();

export async function getAll() {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: 'ADOPTION' },
      },
    })
  );

  if (!result.Items || result.Items.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'No adoptions found' }),
    };
  }
  const items = result.Items.map((adoption) => unmarshall(adoption));
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: items,
    }),
  };
}
