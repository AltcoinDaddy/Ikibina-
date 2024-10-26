"use client";

import { useWeb3 } from "@/contexts/web3-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface MemberListProps {
  groupId: string;
}

export function MemberList({ groupId }: MemberListProps) {
  const { contract } = useWeb3();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [contract, groupId]);

  const loadMembers = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const group = await contract.getGroupInfo(groupId);
      const memberDetails = await Promise.all(
        group.members.map(async (address: string) => {
          const member = await contract.getMemberInfo(groupId, address);
          return {
            address,
            name: member.name,
            totalContributed: member.totalContributed.toString(),
            hasReceivedPot: member.hasReceivedPot,
          };
        })
      );
      setMembers(memberDetails);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.address}
              className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {member.name ? member.name.slice(0, 2).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.address.slice(0, 6)}...{member.address.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {ethers.utils.formatEther(member.totalContributed)} ETH
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.hasReceivedPot ? "Received" : "Waiting"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
