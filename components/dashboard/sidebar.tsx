"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  Activity,
  Settings,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Groups",
    href: "/dashboard/groups",
    icon: Users,
  },
  {
    title: "Savings",
    href: "/dashboard/savings",
    icon: PiggyBank,
  },
  {
    title: "Activity",
    href: "/dashboard/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-card px-3 py-4">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold">Ikibina Digital</h1>
      </div>
      <div className="space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}