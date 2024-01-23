import Link from "next/link"
import { redirect } from "next/navigation"
import { UserButton, auth } from "@clerk/nextjs"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  const { userId } = auth()

  if (userId) {
    return redirect("/dashboard/overview")
  }

  return redirect("/auth/sign-in")
}
