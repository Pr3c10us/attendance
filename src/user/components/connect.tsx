import { useConnect } from "wagmi";

const Connect = () => {
  const { connectors, connect } = useConnect();

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full space-y-8 rounded-2xl border border-black/5 bg-white p-4 py-8 text-center shadow-xl md:w-1/3 md:p-8">
        <h1 className="text-2xl font-semibold md:text-4xl">Connect a wallet</h1>
        <div className="flex flex-col items-start gap-4">
          {connectors.map((connector) => {
            if (connector.id != "injected") {
              return (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="flex w-full items-center justify-center gap-4 text-nowrap rounded-full border px-4 py-2.5 text-left font-semibold"
                >
                  {(connector.id == "coinbaseWalletSDK" ||
                    connector.id == "io.metamask" ||
                    connector.id == "walletConnect") && (
                    <span className="flex aspect-square w-8 items-center justify-center">
                      <img
                        src={`./${connector.id}.svg`}
                        alt={connector.name}
                        className="w-full"
                      />
                    </span>
                  )}
                  <span className="w-1/3 text-sm md:text-base">
                    {connector.name}
                  </span>
                </button>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default Connect;
