import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { login, logout, user, authenticated } = usePrivy();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      login(); // ✅ Auto-connect MiniPay users
    }
  }, [login]);

  return (
    <div className="relative flex h-10">
      <div className="pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        {!hideConnectBtn && (
          <button
            onClick={authenticated ? logout : login}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {authenticated ? `Disconnect (${user?.wallet?.address.slice(0, 6)}...)` : "Connect with Privy"}
          </button>
        )}
      </div>
    </div>
  );
}
