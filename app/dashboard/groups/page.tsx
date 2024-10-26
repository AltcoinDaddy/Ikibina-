"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/contexts/web3-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GroupCard } from "@/components/features/group-card";
import { Loader2 } from "lucide-react";
import { CreateGroupDialog } from "@/components/features/create-group-dialog";

interface Group {
  id: number;
  name: string;
  description: string;
  contributionAmount: string;
  members: string[];
  active: boolean;
}

export default function GroupsPage() {
  const { contract, address } = useWeb3();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, [contract, address]);

  const loadGroups = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const groupCount = await contract.groupCount();
      const loadedGroups = [];

      for (let i = 1; i <= groupCount; i++) {
        const group = await contract.getGroupInfo(i);
        loadedGroups.push({
          id: i,
          name: group.name,
          description: group.description,
          contributionAmount: group.contributionAmount.toString(),
          members: group.members,
          active: group.active,
        });
      }

      setGroups(loadedGroups);
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Groups</h2>
        <CreateGroupDialog>
          <Button>Create New Group</Button>
        </CreateGroupDialog>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Groups Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create your first group to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
