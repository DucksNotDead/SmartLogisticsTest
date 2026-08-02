import {
  ApiError,
  isProblemDetail,
  isValidationProblem,
  type ProblemDetail,
  type ValidationProblem,
} from './errors'

export const BASE_URL = '/api/v1'

/** Origin for Node/Vitest; browser keeps relative `/api/v1/...`. */
const TEST_ORIGIN = 'http://localhost'

function resolveUrl(url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url
  }

  const path = url.startsWith(BASE_URL)
    ? url
    : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`

  if (typeof window === 'undefined') {
    return new URL(path, TEST_ORIGIN).href
  }

  return path
}

async function parseErrorBody(
  response: Response,
): Promise<ProblemDetail | ValidationProblem | unknown> {
  const text = await response.text()
  if (!text) return undefined

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function parseSuccessBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

/**
 * Orval mutator: fetch + JSON, base `/api/v1`, typed API errors.
 */
export async function customFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const { headers, ...init } = options

  const response = await fetch(resolveUrl(url), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const body = await parseErrorBody(response)

    if (response.status === 422 && isValidationProblem(body)) {
      throw new ApiError(response.status, body)
    }

    if (
      (response.status === 401 ||
        response.status === 404 ||
        response.status === 503) &&
      isProblemDetail(body)
    ) {
      throw new ApiError(response.status, body)
    }

    throw new ApiError(response.status, body)
  }

  return parseSuccessBody<T>(response)
}
