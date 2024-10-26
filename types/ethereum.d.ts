// types/ethereum.d.ts
interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      providers?: any[];
      selectedAddress?: string;
      networkVersion?: string;
      chainId?: string;
    };
  }