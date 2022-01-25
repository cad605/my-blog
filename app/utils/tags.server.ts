import { Tag, Prisma } from '@prisma/client'
import { db } from './db.server'

export async function getTags(query: Prisma.TagFindManyArgs): Promise<Tag[]> {
  const tags = await db.tag.findMany(query)
  return tags
}
