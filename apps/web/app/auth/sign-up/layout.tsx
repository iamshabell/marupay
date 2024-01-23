import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import { FadeIn } from "@/components/fade-in"

export const runtime = "edge"
export default function AuthLayout(props: { children: React.ReactNode }) {
  const { userId } = auth()

  if (userId) {
    return redirect("/dashboard/overview")
  }
  return (
    <FadeIn>
      <div className="grid h-screen  grid-cols-1 place-items-center bg-white">
        <div className="container">{props.children}</div>
      </div>
    </FadeIn>
  )
}
