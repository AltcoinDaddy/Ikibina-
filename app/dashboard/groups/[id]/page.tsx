// app/dashboard/groups/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/contexts/web3-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";
import { MemberList } from "@/components/features/member-list";
import { ContributionForm } from "@/components/features/contribution-form";
import { GroupProgress } from "@/components/features/group-progress";
import { ContributionHistory } from "@/components/features/contribution-history";

interface GroupDetails {
  name: string;
  description: string;
  contributionAmount: string;
  members: string[];
  active: boolean;
  currentRound: number;
}

export default function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { contract } = useWeb3();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroupDetails();
  }, [contract, params.id]);

  const loadGroupDetails = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const groupInfo = await contract.getGroupInfo(params.id);
      setGroup({
        name: groupInfo.name,
        description: groupInfo.description,
        contributionAmount: groupInfo.contributionAmount.toString(),
        members: groupInfo.members,
        active: groupInfo.active,
        currentRound: groupInfo.currentRound.toNumber(),
      });
    } catch (error) {
      console.error("Error loading group details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !group) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{group.name}</h2>
        <Button variant="outline">Invite Members</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Contribution Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {ethers.utils.formatEther(group.contributionAmount)} ETH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{group.members.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Round</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{group.currentRound}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Group Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                <GroupProgress groupId={params.id} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <MemberList groupId={params.id} />
        </TabsContent>

        <TabsContent value="contribute">
          <ContributionForm
            groupId={params.id}
            amount={group.contributionAmount}
          />
        </TabsContent>

        <TabsContent value="history">
          <ContributionHistory groupId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
