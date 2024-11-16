import { useConnect } from "wagmi";

const Connect = () => {
  const { connectors, connect } = useConnect();

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-1/3 space-y-8 rounded-2xl border border-black/5 bg-white p-8 text-center shadow-xl">
        <h1 className="text-4xl font-semibold">Connect a wallet</h1>
        <div className="flex flex-col items-start gap-4">
          {connectors.map((connector) => {
            if (connector.id != "injected") {
              return (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="flex w-full items-center justify-center gap-4 rounded-full border py-2.5 text-left font-semibold"
                >
                  <span className="flex aspect-square w-8 items-center justify-center">
                    <img
                      src={`./${connector.id}.svg`}
                      alt={connector.name}
                      className="w-full"
                    />
                  </span>
                  <span className="w-1/3">{connector.name}</span>
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
