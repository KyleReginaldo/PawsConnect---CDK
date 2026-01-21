import { APIGatewayProxyEvent } from 'aws-lambda';
import { adoptPet } from './adopt-pet';
import { getAll } from './get-all';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = event.body;
    switch (event.httpMethod) {
      case 'POST':
        return await adoptPet({ body });
      case 'GET':
        return await getAll();
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
