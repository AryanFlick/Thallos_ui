import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Thallos",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID", // Get this from WalletConnect Cloud
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NODE_ENV === "development" ? [sepolia] : []),
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

