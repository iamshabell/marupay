"use client"

import * as React from "react"
import { useSignIn } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toaster"
import { Loading } from "@/components/dashboard/loading"

export function EmailSignIn(props: {
  verification: (value: boolean) => void
  dialog: (value: boolean) => void
  email: (value: string) => void
  emailValue: string
}) {
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn()
  const [isLoading, setIsLoading] = React.useState(false)

  const signInWithCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get("email")
    if (!signInLoaded || typeof email !== "string") {
      return null
    }
    setIsLoading(true)
    await signIn
      .create({
        identifier: email,
      })
      .then(async () => {
        const firstFactor = signIn.supportedFirstFactors.find(
          (f) => f.strategy === "email_code"
        ) as { emailAddressId: string } | undefined

        if (firstFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: firstFactor.emailAddressId,
          })

          setIsLoading(false)
          props.verification(true)
        }
      })
      .catch((err) => {
        setIsLoading(false)
        if (err.errors[0].code === "form_identifier_not_found") {
          props.dialog(true)
          props.email(email)
        } else {
          toast.error("Sorry, We couldn't sign you in. Please try again later")
        }
      })
  }
  return (
    <>
      <form className="grid gap-2" onSubmit={signInWithCode}>
        <div className="grid gap-1">
          <Input
            name="email"
            placeholder="name@example.com"
            type="email"
            defaultValue={props.emailValue}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required
            className="border-gray-300 bg-gray-50 "
          />
        </div>
        <Button
          className="border-black bg-black text-white hover:bg-gray-100 hover:text-black"
          disabled={isLoading}
        >
          {isLoading && <Loading className="mr-2 size-4 animate-spin" />}
          Sign In with Email
        </Button>
      </form>
    </>
  )
}
