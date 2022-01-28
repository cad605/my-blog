import * as React from 'react'
import { useId } from '@reach/auto-id'

function Label({ className, ...labelProps }: JSX.IntrinsicElements['label']) {
  return (
    <label
      className="block text-xl text-zinc-800 font-medium"
      {...labelProps}
    />
  )
}

type InputProps =
  | ({ type: 'textarea' } & JSX.IntrinsicElements['textarea'])
  | JSX.IntrinsicElements['input']

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref,
) {
  if (props.type === 'textarea') {
    return (
      <textarea
        {...(props as JSX.IntrinsicElements['textarea'])}
        className={props.className}
      />
    )
  }

  return (
    <input
      {...(props as JSX.IntrinsicElements['input'])}
      className={props.className}
      ref={ref}
    />
  )
})

interface InputErrorProps {
  id: string
  children?: string | null
}

function InputError({ children, id }: InputErrorProps) {
  if (!children) {
    return null
  }

  return (
    <p role="alert" id={id} className="text-sm text-red-500">
      {children}
    </p>
  )
}

const Field = React.forwardRef<
  HTMLInputElement,
  {
    defaultValue?: string | null
    name: string
    label: string
    className?: string
    error?: string | null
    description?: React.ReactNode
  } & InputProps
>(function Field(
  { defaultValue, error, name, label, className, description, id, ...props },
  ref,
) {
  const prefix = useId()
  const inputId = id ?? `${prefix}-${name}`
  const errorId = `${inputId}-error`
  const descriptionId = `${inputId}-description`

  return (
    <div className={className}>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <Label htmlFor={inputId}>{label}</Label>
        {error ? (
          <InputError id={errorId}>{error}</InputError>
        ) : description ? (
          <div id={descriptionId} className="text-primary text-lg">
            {description}
          </div>
        ) : null}
      </div>

      <Input
        // @ts-expect-error no idea 🤷‍♂️
        ref={ref}
        {...(props as InputProps)}
        name={name}
        id={inputId}
        autoComplete={name}
        required
        defaultValue={defaultValue}
        aria-describedby={
          error ? errorId : description ? descriptionId : undefined
        }
      />
    </div>
  )
})

function ErrorPanel({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <div role="alert" className="relative mt-8 px-11 py-8" id={id}>
      <div className="absolute inset-0 rounded-lg bg-red-500 opacity-25" />
      <div className="text-primary relative text-lg font-medium">
        {children}
      </div>
    </div>
  )
}

export { Label, Input, InputError, Field, ErrorPanel }
