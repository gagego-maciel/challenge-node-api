import { faker } from '@faker-js/faker';
import { db } from '../../database/client.ts';
import { courses } from '../../database/schema.ts';
import { randomUUID } from 'node:crypto';

export async function makeCource(title?: string) {
  const result = await db
    .insert(courses)
    .values({
      id: randomUUID(),
      title: title ?? faker.lorem.words(4),
      description: faker.lorem.sentence(6),
    })
    .returning();

  return result[0];
}
