import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ethers } from "ethers"
import Link from "next/link"
import { Users } from "lucide-react"

interface GroupCardProps {
  group: {
    id: number
    name: string
    description: string
    contributionAmount: string
    members: string[]
    active: boolean
  }
}

export function GroupCard({ group }: GroupCardProps) {
  const contributionEth = ethers.utils.formatEther(group.contributionAmount)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{group.name}</span>
          {group.active ? (
            <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
              Active
            </span>
          ) : (
            <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-1 rounded-full">
              Inactive
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {group.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{group.members.length} members</span>
          </div>
          <span>{contributionEth} ETH / round</span>
        </div>
        <Button asChild className="w-full">
          <Link href={`/dashboard/groups/${group.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}