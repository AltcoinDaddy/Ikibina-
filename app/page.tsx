// app/page.tsx
import { CreateGroupDialog } from "@/components/features/create-group-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, Wallet } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <CreateGroupDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Group
          </Button>
        </CreateGroupDialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="groups">My Groups</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.42 ETH</div>
                <p className="text-xs text-muted-foreground">
                  +0.05 ETH from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Groups
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Member in 2 active groups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Contributed
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.25 ETH</div>
                <p className="text-xs text-muted-foreground">
                  Across all groups
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add activity list component here */}
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add upcoming contributions component here */}
                <p className="text-sm text-muted-foreground">
                  No upcoming contributions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {/* Add groups list component here */}
          <p className="text-muted-foreground">No groups joined yet</p>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {/* Add activity feed component here */}
          <p className="text-muted-foreground">No recent activity</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
