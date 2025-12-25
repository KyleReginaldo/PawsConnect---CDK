import { APIGatewayProxyEvent } from 'aws-lambda';
import { deletePost } from './delete';
import { getOne } from './get-one';
import { updatePost } from './update';

export const handler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters?.id;
  const userId = event.queryStringParameters?.userId;
  const body = event.body;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing id parameter' }),
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getOne({ id });
      case 'DELETE':
        return await deletePost({ id });
      case 'PUT':
        if (!userId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing userId query parameter' }),
          };
        }
        return await updatePost({ id, body: body, userId: userId });
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP method' }),
        };
    }
  } catch (error) {
    console.log(`post handler error: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
