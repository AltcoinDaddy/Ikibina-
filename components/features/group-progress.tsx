"use client";

import { useWeb3 } from "@/contexts/web3-context";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

interface GroupProgressProps {
  groupId: string;
}

export function GroupProgress({ groupId }: GroupProgressProps) {
  const { contract } = useWeb3();
  const [progress, setProgress] = useState(0);
  const [currentTarget, setCurrentTarget] = useState("0");
  const [collected, setCollected] = useState("0");

  useEffect(() => {
    loadProgress();
  }, [contract, groupId]);

  const loadProgress = async () => {
    if (!contract) return;
    try {
      const round = await contract.groupRounds(
        groupId,
        await contract.currentRound()
      );
      const totalCollected = round.totalCollected.toString();
      const target = ethers.BigNumber.from(round.contributionAmount).mul(
        round.members.length
      );

      setCurrentTarget(target.toString());
      setCollected(totalCollected);
      setProgress((Number(totalCollected) / Number(target)) * 100);
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Round Progress</span>
        <span>{progress.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{ethers.utils.formatEther(collected)} ETH collected</span>
        <span>{ethers.utils.formatEther(currentTarget)} ETH target</span>
      </div>
    </div>
  );
}
