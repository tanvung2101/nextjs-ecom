// lib/http.ts
import envConfig from "@/config"
import { toast } from "react-toastify"

type CustomOptions = RequestInit & {
  baseUrl?: string
  _retry?: boolean
}

let refreshPromise: Promise<boolean> | null = null

const isClient = () => typeof window !== "undefined"

// ========================
// REFRESH TOKEN
// ========================
async function refreshToken(baseUrl: string): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          return false
        }
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

// ========================
// CORE REQUEST
// ========================
async function request<T>(
  method: string,
  url: string,
  options?: CustomOptions
): Promise<T> {
  const baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`

  const isRefreshEndpoint = fullUrl.includes("/auth/refresh-token")

  // ========================
  // BODY
  // ========================
  const body =
    options?.body instanceof FormData
      ? options.body
      : options?.body
      ? JSON.stringify(options.body)
      : undefined

  // ========================
  // HEADERS
  // ========================
  const headers: Record<string, string> =
    options?.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json", ...(options?.headers as any) }

  // ========================
  // FETCH WITH TIMEOUT
  // ========================
  const fetchData = async (): Promise<Response> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      return await fetch(fullUrl, {
        ...options,
        method,
        headers,
        body,
        credentials: "include",
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  let res = await fetchData()

  // ========================
  // HANDLE 401 → REFRESH TOKEN
  // ========================
  if (res.status === 401 && !options?._retry && !isRefreshEndpoint) {
    const ok = await refreshToken(baseUrl)

    if (!ok) {
      if (isClient()) {
        localStorage.clear()
        window.location.href = "/login"
      }

      throw new Error("Unauthorized")
    }

    // retry 1 lần duy nhất
    return request<T>(method, url, {
      ...options,
      _retry: true,
    })
  }

  // ========================
  // HANDLE ERROR
  // ========================
  if (!res.ok) {
    let errorMessage = "Unknown error"

    try {
      const err = await res.json()

      if (Array.isArray(err?.message)) {
        errorMessage = err.message?.[0]?.message
      } else {
        errorMessage = err?.message || err?.error || errorMessage
      }
    } catch {
      // ignore json parse error
    }

    toast.error(errorMessage)

    throw {
      status: res.status,
      message: errorMessage,
    }
  }

  // ========================
  // SAFE JSON PARSE
  // ========================
  try {
    return await res.json()
  } catch {
    return {} as T
  }
}

// ========================
// EXPORT API
// ========================
const http = {
  get<T>(url: string, options?: CustomOptions) {
    return request<T>("GET", url, options)
  },

  post<T>(url: string, body?: any, options?: CustomOptions) {
    return request<T>("POST", url, { ...options, body })
  },

  put<T>(url: string, body?: any, options?: CustomOptions) {
    return request<T>("PUT", url, { ...options, body })
  },

  delete<T>(url: string, options?: CustomOptions) {
    return request<T>("DELETE", url, options)
  },
}

export default http