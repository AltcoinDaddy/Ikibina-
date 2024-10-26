"use client";

import { useWeb3 } from "@/contexts/web3-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";

interface ContributionHistoryProps {
  groupId: string;
}

export function ContributionHistory({ groupId }: ContributionHistoryProps) {
  const { contract } = useWeb3();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [contract, groupId]);

  const loadHistory = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const filter = contract.filters.ContributionMade(groupId);
      const events = await contract.queryFilter(filter);
      const formattedHistory = await Promise.all(
        events.map(async (event) => {
          const block = await event.getBlock();
          return {
            contributor: event.args?.member,
            amount: event.args?.amount.toString(),
            timestamp: block.timestamp,
            transactionHash: event.transactionHash,
          };
        })
      );
      setHistory(formattedHistory);
    } catch (error) {
      console.error("Error loading history:", error);
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
        <CardTitle>Contribution History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No contributions yet
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.transactionHash}
                className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
              >
                <div>
                  <p className="font-medium">
                    {item.contributor.slice(0, 6)}...
                    {item.contributor.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-medium">
                  {ethers.utils.formatEther(item.amount)} ETH
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
