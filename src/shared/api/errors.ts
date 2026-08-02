export type ProblemDetail = {
  code: string
  title: string
  message: string
  trace_id?: string | null
}

export type ValidationError = {
  field: string
  message: string
  code?: string | null
}

export type ValidationProblem = {
  code: string
  title: string
  message: string
  trace_id?: string | null
  errors: ValidationError[]
}

export class ApiError extends Error {
  readonly status: number
  readonly body: ProblemDetail | ValidationProblem | unknown

  constructor(
    status: number,
    body: ProblemDetail | ValidationProblem | unknown,
    message?: string,
  ) {
    super(message ?? resolveApiErrorMessage(status, body))
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function isProblemDetail(value: unknown): value is ProblemDetail {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.code === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.message === 'string'
  )
}

export function isValidationProblem(value: unknown): value is ValidationProblem {
  if (!isProblemDetail(value)) return false
  if (!('errors' in value) || !Array.isArray(value.errors)) return false
  return value.errors.every((item) => {
    if (typeof item !== 'object' || item === null) return false
    const error = item as Record<string, unknown>
    return typeof error.field === 'string' && typeof error.message === 'string'
  })
}

function resolveApiErrorMessage(
  status: number,
  body: ProblemDetail | ValidationProblem | unknown,
): string {
  if (isProblemDetail(body)) return body.message
  return `API request failed with status ${status}`
}
