import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

export const config = getDefaultConfig({
  appName: "erc20-indexer",
  projectId: "d8a27188d744a307a139528fc13efa6d",
  chains: [sepolia],
});

export const queryClient = new QueryClient();
