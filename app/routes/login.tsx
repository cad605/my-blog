import {
  useTransition,
  useActionData,
  Form,
  json,
  useCatch,
  useSearchParams,
} from 'remix'
import type { ActionFunction, MetaFunction } from 'remix'
import { login, createUserSession } from '~/utils/session.server'
import invariant from 'tiny-invariant'
import { ErrorPanel, Field } from '~/components/form-elements'
import { ServerError, MissingPage } from '~/components/errors'

export const meta: MetaFunction = () => {
  return {
    title: 'Christopher Donnelly | Login',
    description: 'Login to my personal site',
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    password: string
    username: string
    redirectTo: string
  }
}

function validateFieldType(field: unknown) {
  if (typeof field !== 'string') {
    return `This field is required.`
  }
}

const badRequest = (data: any) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const password = formData.get('password')
  const username = formData.get('username')
  const redirectTo = formData.get('redirectTo') || '/'

  const fieldErrors = {
    username: validateFieldType(username),
    password: validateFieldType(password),
    redirectTo: validateFieldType(redirectTo),
  }

  const fields = { password, username, redirectTo }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  // make TS happy
  invariant(typeof username == 'string')
  invariant(typeof password == 'string')
  invariant(typeof redirectTo == 'string')

  const user = await login({ username, password })
  if (!user) {
    return badRequest({
      fields,
      formError: `Incorrect Username or Password`,
    })
  }

  return createUserSession(user.id, redirectTo)
}

export default function NewPost() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  return (
    <div className="flex flex-col space-y-2 bg-zinc-100 border-2 border-slate-600 p-4 rounded-xl">
      <div className="flex justify-center">
        <h1 className="text-2xl md:text-3xl font-bold">Login</h1>
      </div>
      <hr></hr>
      <Form
        method="post"
        className="flex flex-col space-y-4"
        aria-describedby="login-form-error"
      >
        {actionData?.formError ? (
          <ErrorPanel id="login-form-error">{actionData?.formError}</ErrorPanel>
        ) : null}
        <input
          type="hidden"
          id="redirectTo-input"
          name="redirectTo"
          value={searchParams.get('redirectTo') ?? '/'}
        />
        <Field
          name="username"
          id="username-input"
          label="Username"
          type="text"
          placeholder="Username"
          defaultValue={actionData?.fields?.username ?? ''}
          error={actionData?.fieldErrors?.username}
        />
        <Field
          name="password"
          id="password-input"
          label="Password"
          type="password"
          placeholder="Password"
          defaultValue={actionData?.fields?.password ?? ''}
          error={actionData?.fieldErrors?.password}
        />
        <button
          type="submit"
          className="transfrom hover:-translate-y-1 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-800 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:bg-slate-600"
        >
          {transition.submission ? 'Logging in...' : 'Log In'}
        </button>
      </Form>
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
