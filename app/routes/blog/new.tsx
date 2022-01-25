import { useTransition, useActionData, Form, json, useCatch, Link } from 'remix'
import type { ActionFunction, LoaderFunction } from 'remix'
import invariant from 'tiny-invariant'
import { marked } from 'marked'
import slugify from 'slugify'
import fm from 'front-matter'
import ArrowButton from '~/components/arrow-button'
import { createNewBlog } from '~/utils/blog.server'
import { requireUserId } from '~/utils/session.server'
import TagPicker from '~/components/tag-picker'

import comboboxStyles from '@reach/combobox/styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: comboboxStyles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return {}
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    title: boolean | undefined
    description: boolean | undefined
    markdown: boolean | undefined
  }
  fields?: {
    slug: string
    title: string
    description: string
    markdown: string
    html: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const title = formData.get('title')
  const description = formData.get('description')
  const markdown = formData.get('markdown')

  const fieldErrors = {
    title: false,
    description: false,
    markdown: false,
  }

  if (!title) fieldErrors.title = true
  if (!title) fieldErrors.description = true
  if (!markdown) fieldErrors.markdown = true

  invariant(typeof title === 'string')
  invariant(typeof description === 'string')
  invariant(typeof markdown === 'string')

  const slug = slugify(title)
  const { body } = fm(`---\ntitle: ${title}\n---\n\n${markdown}`)
  const html = marked(body)

  const fields = { slug, title, description, markdown, html }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }
  return await createNewBlog({ data: { ...fields, userId: userId } })
}

export const handle = {
  breadcrumb: () => {
    ;<ArrowButton direction="left" href="/">
      Home
    </ArrowButton>
  },
}

export default function NewPost() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <div>
      <section className="md:relative mb-4 sm:flex sm:flex-col space-y-4">
        <h1 className="text-zinc-800 text-4xl font-bold">New Post</h1>
      </section>
      <hr></hr>
      <section>
        <Form method="post" className="mt-4 space-y-4">
          <div>
            <label
              className="block text-xl text-zinc-800 font-medium"
              htmlFor="title"
            >
              Title:{' '}
              {actionData?.fieldErrors?.title ? (
                <em role="alert" id="name-error">
                  Title is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="text"
                required={true}
                defaultValue={actionData?.fields?.title}
                id="title"
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.title) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.title ? 'title-error' : undefined
                }
              />
            </div>
          </div>
          <div>
            <label
              className="block text-xl text-zinc-800 font-medium"
              htmlFor="description"
            >
              Description:{' '}
              {actionData?.fieldErrors?.description ? (
                <em role="alert" id="name-error">
                  description is required
                </em>
              ) : null}
            </label>
            <div>
              <input
                type="text"
                required={true}
                defaultValue={actionData?.fields?.description}
                id="description"
                aria-required={true}
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.description) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.description
                    ? 'description-error'
                    : undefined
                }
              />
            </div>
          </div>
          <TagPicker></TagPicker>
          <div>
            <label
              className="block text-xl text-zinc-800 font-medium"
              htmlFor="markdown"
            >
              Markdown:
            </label>{' '}
            {actionData?.fieldErrors?.markdown ? (
              <em>Markdown is required</em>
            ) : null}
            <textarea id="markdown" cols={60} rows={10} />
          </div>
          <button
            type="submit"
            className="transfrom hover:-translate-y-1 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-800 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:bg-slate-600"
          >
            {transition.submission ? 'Creating Post...' : 'Post Blog'}
          </button>
        </Form>
      </section>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  switch (caught.status) {
    case 401: {
      return (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
          <p className="text-2xl text-slate-600">
            You're either me and you haven't logged in, or you're not supposed
            to be here so scram!
          </p>
          <Link to="/login">Login</Link>
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="font-bold text-4xl text-zinc-800">Sorry!</h1>
      <p className="text-2xl text-slate-600">
        Something went wrong creating the blog post...
      </p>
      <p className="text-xl text-slate-600">{error.message}</p>
    </div>
  )
}
