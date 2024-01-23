"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Book, ChevronRight, LogOut, Rocket, Settings } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const UserButton: React.FC = () => {
  const { user } = useUser()
  const router = useRouter()

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 px-6 py-3 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Avatar className="size-8">
            {user.imageUrl ? (
              <AvatarImage src={user.imageUrl} alt="Profile picture" />
            ) : null}
            <AvatarFallback className=" size-8 overflow-hidden rounded-md border border-gray-500 bg-gray-100 text-gray-700">
              {(user?.fullName ?? "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full overflow-hidden text-ellipsis">
                <span className="overflow-hidden text-ellipsis text-sm font-semibold">
                  {user.username ??
                    user.fullName ??
                    user.primaryEmailAddress?.emailAddress}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-sm font-semibold">
                  {user.username ??
                    user.fullName ??
                    user.primaryEmailAddress?.emailAddress}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ChevronRight className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-96">
        <DropdownMenuGroup>
          <Link href="https://marupay.dev/" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <Book className="mr-2 size-4" />
              <span>Docs</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <SignOutButton signOutCallback={() => router.push("/auth/sign-in")}>
            <DropdownMenuItem asChild className="cursor-pointer">
              <span>
                <LogOut className="mr-2 size-4" />
                Sign out
              </span>
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
