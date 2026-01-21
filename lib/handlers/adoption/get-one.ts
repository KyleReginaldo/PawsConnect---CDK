import {
  BatchGetItemCommand,
  DynamoDB,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
const dynamodb = new DynamoDB();
export async function getOne({ id }: { id: string }) {
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing id parameter' }),
    };
  }

  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: 'ADOPTION' },
        ':sk': { S: `ADOPTION#${id}` },
      },
    })
  );
  if (!result.Items || result.Items.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Adoption not found' }),
    };
  }
  const adoption = unmarshall(result.Items[0]);
  const batchResult = await dynamodb.send(
    new BatchGetItemCommand({
      RequestItems: {
        [process.env.TABLE_NAME!]: {
          Keys: [
            {
              pk: { S: adoption.pk },
              sk: { S: `PROFILE` },
            },
            {
              pk: { S: `USER#${adoption.userId}` },
              sk: { S: `PROFILE` },
            },
          ],
        },
      },
    })
  );
  const items = batchResult.Responses?.[process.env.TABLE_NAME!] || [];
  const pet = items.find((item) => item.pk.S?.startsWith('PET#'));
  const user = items.find((item) => item.pk.S?.startsWith('USER#'));
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        ...adoption,
        pet: pet ? unmarshall(pet) : null,
        user: user ? unmarshall(user) : null,
      },
    }),
  };
}
