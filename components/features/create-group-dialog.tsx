// components/features/create-group-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useWeb3 } from "@/contexts/web3-context";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

export function CreateGroupDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { contract, address } = useWeb3();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contributionAmount: "",
    roundDuration: "30",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !address) return;

    setLoading(true);
    try {
      const tx = await contract.createGroup(
        formData.name,
        formData.description,
        ethers.utils.parseEther(formData.contributionAmount),
        parseInt(formData.roundDuration) * 86400 // Convert days to seconds
      );
      await tx.wait();

      toast({
        title: "Success",
        description: "Group created successfully!",
      });
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        contributionAmount: "",
        roundDuration: "30",
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new savings group. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter group name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your group"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Contribution Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.contributionAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contributionAmount: e.target.value,
                  })
                }
                placeholder="0.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Round Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.roundDuration}
                onChange={(e) =>
                  setFormData({ ...formData, roundDuration: e.target.value })
                }
                placeholder="30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
