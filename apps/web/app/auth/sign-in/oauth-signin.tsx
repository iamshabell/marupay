"use client"

import * as React from "react"
import { useSignIn } from "@clerk/nextjs"
import type { OAuthStrategy } from "@clerk/types"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"
import { Loading } from "@/components/dashboard/loading"

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null)
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { toast } = useToast()

  const oauthSignIn = async (provider: OAuthStrategy) => {
    if (!signInLoaded) {
      return null
    }
    try {
      setIsLoading(provider)
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/auth/sso-callback",
        redirectUrlComplete: "/dashboard/overview",
      })
    } catch (cause) {
      console.error(cause)
      setIsLoading(null)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong, please try again.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="border-gray-300 bg-gray-50 text-black hover:bg-black hover:text-white"
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
