import { APIGatewayProxyEvent } from "aws-lambda";
import { deletePost } from "./delete";
import { getOne } from "./get-one";

export const handler = async (event: APIGatewayProxyEvent) => {
    const id = event.pathParameters?.id;
    if(!id){
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing id parameter"})
        }
    }

    try {
        switch(event.httpMethod) {
            case 'GET':
                return await getOne({ id});
            case 'DELETE':
                return await deletePost({ id });
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: "Invalid HTTP method"})
                }
        }
    } catch (error) {
        console.log(`post handler error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({message: error})
        }
    }


}