"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toaster"
import { Loading } from "@/components/dashboard/loading"
import { FadeInStagger } from "@/components/fade-in"

export function EmailSignUp(props: { verification: (value: boolean) => void }) {
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp()

  const [isLoading, setIsLoading] = React.useState(false)
  const [transferLoading, setTransferLoading] = React.useState(true)
  const router = useRouter()
  React.useEffect(() => {
    const signUpFromParams = async () => {
      const ticket = new URL(window.location.href).searchParams.get(
        "__clerk_ticket"
      )
      const emailParam = new URL(window.location.href).searchParams.get("email")
      if (!ticket && !emailParam) {
        return
      }
      if (ticket) {
        await signUp
          ?.create({
            strategy: "ticket",
            ticket,
          })
          .then((result) => {
            if (result.status === "complete" && result.createdSessionId) {
              setActive({ session: result.createdSessionId }).then(() => {
                router.push("/dashboard/overview")
              })
            }
          })
          .catch((err) => {
            setTransferLoading(false)
            console.error(err)
          })
      }

      if (emailParam) {
        props.verification(true)
        await signUp
          ?.create({
            emailAddress: emailParam,
          })
          .then(async () => {
            await signUp.prepareEmailAddressVerification()
            // set verification to true so we can show the code input
            props.verification(true)
            setTransferLoading(false)
          })
          .catch((err) => {
            setTransferLoading(false)
            if (err.errors[0].code === "form_identifier_exists") {
              toast.error(
                "Sorry, it looks like you have an account. Please use sign in"
              )
            } else {
              console.log("Supress error")
            }
          })
      }
    }
    signUpFromParams()
    setTransferLoading(false)
  }, [props, router, setActive, signUp, signUpLoaded])

  const signUpWithCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get("email")
    const first = new FormData(e.currentTarget).get("first")
    const last = new FormData(e.currentTarget).get("last")

    if (
      !signUpLoaded ||
      typeof email !== "string" ||
      typeof first !== "string" ||
      typeof last !== "string"
    ) {
      return null
    }

    try {
      setIsLoading(true)
      await signUp
        .create({
          emailAddress: email,
          firstName: first,
          lastName: last,
        })
        .then(async () => {
          await signUp.prepareEmailAddressVerification()
          setIsLoading(false)
          // set verification to true so we can show the code input
          props.verification(true)
        })
        .catch((err) => {
          setIsLoading(false)
          if (err.errors[0].code === "form_identifier_exists") {
            toast.error(
              "Sorry, it looks like you have an account. Please use sign in"
            )
          } else {
            toast.error(
              "Sorry, We couldn't sign you up. Please try again later"
            )
          }
        })
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  return (
    <FadeInStagger>
      {!transferLoading && (
        <form className="grid gap-2" onSubmit={signUpWithCode}>
          <div className="grid gap-1">
            <div className="flex flex-row gap-1 ">
              <Input
                name="first"
                placeholder="Mohammed"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                className="bg-background"
              />
              <Input
                name="last"
                placeholder="Ahmed"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                className="bg-background"
              />
            </div>
            <Input
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              className="bg-background"
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loading className="mr-2 size-4 animate-spin" />}
            Sign Up with Email
          </Button>
        </form>
      )}
    </FadeInStagger>
  )
}
