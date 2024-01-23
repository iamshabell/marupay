"use client"

import * as React from "react"
import { useSignUp } from "@clerk/nextjs"
import type { OAuthStrategy } from "@clerk/types"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { toast } from "@/components/ui/toaster"
import { Loading } from "@/components/dashboard/loading"

export function OAuthSignUp() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null)
  const { signUp, isLoaded: signupLoaded } = useSignUp()

  const oauthSignIn = async (provider: OAuthStrategy) => {
    if (!signupLoaded) {
      return null
    }
    try {
      setIsLoading(provider)
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/auth/sso-callback",
        redirectUrlComplete: "/dashboard/overview",
      })
    } catch (cause) {
      console.error(cause)
      setIsLoading(null)
      toast.error("Something went wrong, please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        className="bg-background"
        onClick={() => oauthSignIn("oauth_google")}
      >
        {isLoading === "oauth_google" ? (
          <Loading className="mr-2 size-4" />
        ) : (
          <Icons.google className="mr-2 size-4" />
        )}
        Google
      </Button>
    </div>
  )
}
