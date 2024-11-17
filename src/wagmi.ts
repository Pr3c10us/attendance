import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import EnvironmentVariables from "../utils/environment"
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: EnvironmentVariables.WalletConnectProjectID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },

})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
