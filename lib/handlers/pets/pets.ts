import { APIGatewayProxyEvent } from 'aws-lambda';
import { create } from './create';
import { getAll } from './get-all';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getAll();
      case 'POST':
        return await create(event.body);
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
