import { useAccount } from "wagmi";
import Default from "./components/default";
import Connect from "./components/connect";

function User() {
  const account = useAccount();

  return (
    <>
      <main className="gradient-anim min-h-screen">
        {(account.status == "disconnected" ||
          account.status == "connecting") && (
          <>
            <Connect />
          </>
        )}
        <Default />
      </main>
    </>
  );
}

export default User;
