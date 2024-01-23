"use client"

import { Dispatch, SetStateAction } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Command, LucideIcon } from "lucide-react"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { UserButton } from "./user-button"

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <aside>
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"] as LucideIcon
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false)
                }}
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 size-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          )
        })}
      </nav>
      <UserButton />
    </aside>
  )
}
