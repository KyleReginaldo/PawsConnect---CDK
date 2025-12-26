import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { z } from 'zod';
const dynamodb = new DynamoDB();
export const CreatePetSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  breed: z.string().optional(),
  age: z.number().min(0),
  gender: z.enum(['male', 'female']),
  size: z.enum(['small', 'medium', 'large']),
  isVaccinated: z.boolean(),
  color: z.string().optional(),
  adoptionStatus: z
    .enum(['for_adoption', 'adopted', 'pending'])
    .default('for_adoption'),
});
export async function create(body: string | null) {
  const uuid = randomUUID();
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing request body',
      }),
    };
  }
  try {
    const bodyParsed = CreatePetSchema.parse(JSON.parse(body));
    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME!,
        Item: {
          pk: `PET#${uuid}`,
          createdAt: new Date().toISOString(),
          ...bodyParsed,
        },
      })
    );
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Pet created',
        id: uuid,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request body',
      }),
    };
  }
}
