const {PrismaClient} = require('@prisma/client')
const db = new PrismaClient()

async function seed() {
  const password = process.env.SEED_PASSWORD
  if (typeof password !== 'string') {
    throw new Error('You must set the environment variable')
  }
  const user = await db.user.create({
    data: {
      username: 'christopher_donnelly',
      passwordHash:
        '$2b$10$eXKrgLPaxW2k0njg6zvJN.LYjgLJ1kyu3HPrGEt6odv1InILni3U6', //christopher_donnelly_rmadrid08
    },
  })
}

seed()
