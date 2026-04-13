'use client'

import http from "@/lib/http"



export async function loginWithGoogle() {
  const data = await http.get<{ url: string }>('/auth/google-link')

  // redirect browser → Google
  window.location.href = data.url
}