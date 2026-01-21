import { APIGatewayProxyEvent } from 'aws-lambda';
import { deletePet } from './delete';
import { getOne } from './get-one';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing id parameter' }),
      };
    }

    switch (event.httpMethod) {
      case 'GET':
        return await getOne({ id });
      case 'DELETE':
        return await deletePet({ id });
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP method' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
