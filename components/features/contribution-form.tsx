"use client";

import { useWeb3 } from "@/contexts/web3-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ContributionFormProps {
  groupId: string;
  amount: string;
}

export function ContributionForm({ groupId, amount }: ContributionFormProps) {
  const { contract } = useWeb3();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleContribute = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.contribute(groupId, {
        value: amount,
      });
      await tx.wait();

      toast({
        title: "Success",
        description: "Contribution made successfully!",
      });
    } catch (error) {
      console.error("Error contributing:", error);
      toast({
        title: "Error",
        description: "Failed to make contribution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make Contribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Amount Required</Label>
          <div className="flex items-center space-x-2">
            <Input
              value={ethers.utils.formatEther(amount)}
              disabled
              className="bg-muted"
            />
            <span>ETH</span>
          </div>
        </div>
        <Button
          onClick={handleContribute}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Contributing...
            </>
          ) : (
            "Contribute Now"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
