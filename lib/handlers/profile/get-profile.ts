import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
const dynamodb = new DynamoDB();

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = event.pathParameters?.id;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request: Missing id' }),
      };
    }
    const result = await dynamodb.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
          pk: `USER#${userId}`,
          sk: `METADATA#${userId}`,
        },
      })
    );
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Profile not found' }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: result.Item,
        }),
      };
    }
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
