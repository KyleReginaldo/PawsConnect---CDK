import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { z } from "zod";
const dynamodb = new DynamoDB();

export const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  publicationDate: z.string(),
});
export async function create(body: string| null) {
    const uuid = randomUUID();

    if(!body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing request body"
            })
        };
    }

    const bodyParsed = PostSchema.parse(JSON.parse(body));
    await dynamodb.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            pk: `POST#${uuid}`,
            ...bodyParsed
        }
    }));
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Post created",
            id: uuid
        })
    }

}