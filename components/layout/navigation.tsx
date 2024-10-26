// components/layout/Navigation.tsx
"use client";
import Link from "next/link";
import { useWeb3 } from "@/contexts/web3-context";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";

export function Navigation() {
  const { connect, disconnect, address, isConnected, balance } = useWeb3();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-8 flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Ikibina 
        </Link>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {balance?.slice(0, 6)} ETH
              </span>
              <Button
                variant="outline"
                onClick={disconnect}
                className="flex items-center gap-2"
              >
                <WalletIcon className="h-4 w-4" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Button>
            </div>
          ) : (
            <Button onClick={connect} className="flex items-center gap-2">
              <WalletIcon className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
