"use client"

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

import { Loading } from "@/components/dashboard/loading"

export default function SSOCallback() {
  return (
    <div className="flex h-screen items-center justify-center ">
      <Loading className="size-12" />
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/dashboard/overview"
        afterSignUpUrl="/dashboard/overview"
      />
    </div>
  )
}
