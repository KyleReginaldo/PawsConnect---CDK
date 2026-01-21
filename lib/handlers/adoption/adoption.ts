import { APIGatewayProxyEvent } from 'aws-lambda';
import { deleteAdoption } from './delete';
import { getOne } from './get-one';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;
    switch (event.httpMethod) {
      case 'GET':
        if (!id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing id parameter' }),
          };
        }
        return await getOne({ id });
      case 'DELETE':
        if (!id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing id parameter' }),
          };
        }
        return await deleteAdoption({ id });
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error }),
    };
  }
};
