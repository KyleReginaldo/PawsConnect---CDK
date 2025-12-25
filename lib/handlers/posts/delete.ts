import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB();

export async function deletePost({id} : {id: string}) {
    if(!id){
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Post ID is required"})
        }
    }
    await dynamodb.send(new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            pk: `POST#${id}`
        }
    }));
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Post deleted", id: id})
    }
}