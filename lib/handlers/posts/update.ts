import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

const UpdatePostSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  publicationDate: z.string().nullable().optional(),
});
const dynamodb = new DynamoDB();

export async function updatePost({
  id,
  body,
  userId,
}: {
  id: string;
  userId: string;
  body: string | null;
}) {
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Post ID is required' }),
    };
  }
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing request body' }),
    };
  }

  try {
    const bodyParsed = UpdatePostSchema.parse(JSON.parse(body));
    let updateExpression = 'SET';
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};
    const remove: string[] = [];
    const set: string[] = [];
    if (bodyParsed.title !== undefined) {
      names['#title'] = 'title';

      if (bodyParsed.title === null) {
        remove.push('#title');
      } else {
        values[':title'] = bodyParsed.title;
        set.push('#title = :title');
      }
    }

    if (bodyParsed.description !== undefined) {
      names['#description'] = 'description';

      if (bodyParsed.description === null) {
        remove.push('#description');
      } else {
        values[':description'] = bodyParsed.description;
        set.push('#description = :description');
      }
    }

    if (bodyParsed.publicationDate !== undefined) {
      names['#publicationDate'] = 'publicationDate';

      if (bodyParsed.publicationDate === null) {
        remove.push('#publicationDate');
      } else {
        values[':publicationDate'] = bodyParsed.publicationDate;
        set.push('#publicationDate = :publicationDate');
      }
    }
    const expressions: string[] = [];

    if (set.length) {
      expressions.push(`SET ${set.join(', ')}`);
    }

    if (remove.length) {
      expressions.push(`REMOVE ${remove.join(', ')}`);
    }

    const result = await dynamodb.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
          pk: `USER#${userId}`,
          sk: `POST#${id}`,
        },
        UpdateExpression: expressions.join(' '),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: Object.keys(values).length
          ? values
          : undefined,
        ConditionExpression: 'attribute_exists(sk)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Post updated',
        data: result.Attributes,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : error,
      }),
    };
  }
}
