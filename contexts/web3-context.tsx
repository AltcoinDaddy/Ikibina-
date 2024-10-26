// contexts/web3-context.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import TontineABI from "@/contracts/tontine-club.json";
import { useToast } from "@/hooks/use-toast";

type EthereumProvider = Window["ethereum"];

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  contract: ethers.Contract | null;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getEthereum = (): EthereumProvider | null => {
    if (typeof window !== "undefined" && window.ethereum) {
      return window.ethereum;
    }
    return null;
  };

  const connect = async () => {
    const ethereum = getEthereum();

    if (!ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this application.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        TontineABI,
        signer
      );

      setProvider(provider);
      setContract(contract);
      setAddress(address);
      setChainId(network.chainId);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Failed to connect:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setContract(null);
    setAddress(null);
    setChainId(null);
    setBalance(null);
  };

  useEffect(() => {
    const ethereum = getEthereum();

    if (ethereum) {
      const handleAccountsChanged = () => {
        connect();
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (ethereum?.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        contract,
        address,
        chainId,
        balance,
        isConnected: !!address,
        isLoading,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
