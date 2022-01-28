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
import { ErrorPanel, Field } from '~/components/form-elements'
import { ServerError, MissingPage } from '~/components/errors'

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
    title: string | null | undefined
    description: string | null | undefined
    markdown: string | null | undefined
  }
  fields?: {
    title: string
    description: string
    markdown: string
  }
}

function validateFieldType(field: unknown) {
  if (typeof field !== 'string') {
    return `This field is required.`
  }
}

const badRequest = (data: any) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()

  const title = formData.get('title')
  const description = formData.get('description')
  const markdown = formData.get('markdown')

  const fieldErrors = {
    title: validateFieldType(title),
    description: validateFieldType(description),
    markdown: validateFieldType(markdown),
  }

  const fields = { title, description, markdown }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  // Make TS happy
  invariant(typeof title === 'string')
  invariant(typeof description === 'string')
  invariant(typeof markdown === 'string')

  const slug = slugify(title)
  const { body } = fm(
    `---\ntitle: ${title}\ndescription: ${description}\n---\n\n${markdown}`,
  )
  const html = marked(body)

  return await createNewBlog({
    data: { title, description, markdown, slug, html, userId: userId },
  })
}

export const handle = {
  breadcrumb: () => {
    return (
      <ArrowButton direction="left" href="/blog">
        Blog
      </ArrowButton>
    )
  },
}

export default function NewPost() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <div>
      <div className="md:relative mb-4 sm:flex sm:flex-col space-y-4">
        <h1 className="text-zinc-800 text-4xl font-bold">New Post</h1>
      </div>
      <hr></hr>
      <main>
        <Form
          method="post"
          className="mt-4 space-y-4"
          aria-describedby="new-form-error"
        >
          <Field
            name="title"
            id="title-input"
            label="Title"
            type="text"
            placeholder="Title"
            defaultValue={actionData?.fields?.title ?? ''}
            error={actionData?.fieldErrors?.title}
          />
          <Field
            name="description"
            id="description-input"
            label="Description"
            type="text"
            placeholder="Description"
            defaultValue={actionData?.fields?.description ?? ''}
            error={actionData?.fieldErrors?.description}
          />
          <Field
            name="markdown"
            id="markdown-input"
            label="Markdown"
            type="textarea"
            rows={10}
            cols={60}
            defaultValue={actionData?.fields?.markdown ?? ''}
            error={actionData?.fieldErrors?.markdown}
          />
          <button
            type="submit"
            className="transfrom hover:-translate-y-1 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-800 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:bg-slate-600"
          >
            {transition.submission ? 'Creating Post...' : 'Post Blog'}
          </button>
          {actionData?.formError ? (
            <ErrorPanel id="new-form-error">{actionData?.formError}</ErrorPanel>
          ) : null}
        </Form>
      </main>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ServerError error={error} />
}

export function CatchBoundary() {
  const caught = useCatch()
  console.error('CatchBoundary', caught)
  return <MissingPage />
}
