import {PrismaClient} from '@prisma/client'
import {register} from '~/utils/session.server'
const prisma = new PrismaClient()

async function seed() {
  const user = await register({username: 'cdonnelly', password: 'farewell10c!'})

  await Promise.all(
    getBlog().map(blog => {
      const data = {userId: user.id, ...blog}
      return prisma.blog.create({data})
    }),
  )
}

seed()

function getBlog() {
  return [
    {
      slug: 'first-post',
      title: 'My First Post',
      description: 'My first post on my new website!',
      markdown: `
      ---
      title: Twitter Clone with Raft
      ---
      
      # Raft: Simple Twitter Clone"
      
      This is a simple Twitter clone that implements its distributed SQLite database using Hashicorp's implmentation of Raft.
      SQLite implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inssluge countless other applications that people use every day.
But it isn't distributed! That's where Raft comes in...
`,
    },
    {
      slug: 'second-post',
      title: 'My Second Post',
      description: 'My second post on my new website!',
      markdown: `
      ---
      title: Twitter Clone with Raft
      ---
      
      ## Raft: Simple Twitter Clone"
      
      This is a simple Twitter clone that implements its distributed SQLite database using Hashicorp's implmentation of Raft.
      SQLite implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inssluge countless other applications that people use every day.
But it isn't distributed! That's where Raft comes in...
`,
    },
    {
      slug: 'third-post',
      title: 'My Third Post',
      description: 'My third post on my new website!',
      markdown: `

      ---
title: 90s Mixtape
---

# 90s Mixtape

- I wish (Skee-Lo)
- This Is How We Do It (Montell Jordan)
- Everlong (Foo Fighters)
      
      `,
    },
    {
      slug: 'fourth-post',
      title: 'My Fourth Post',
      description: 'My fourth post on my new website!',
      markdown: `

---
title: 90s Mixtape
---

# 90s Mixtape

- I wish (Skee-Lo)
- This Is How We Do It (Montell Jordan)
- Everlong (Foo Fighters)
      
      `,
    },
  ]
}
