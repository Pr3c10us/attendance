interface Environment {
    WalletConnectProjectID: string
}

const EnvironmentVariables: Environment = {
    WalletConnectProjectID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
}

export default EnvironmentVariables