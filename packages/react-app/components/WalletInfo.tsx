/* eslint-disable @next/next/no-img-element */
import blockies from "ethereum-blockies";
import { useUserRole } from "@/context/UserRoleContext";
import { useWalletsContext } from "@/context/WalletProvider";

interface WalletInfoProps {
  showZar: boolean;
  zarBalance: string | null;
  setShowZar: (value: boolean) => void;
}

const WalletInfo = ({ showZar, zarBalance, setShowZar }: WalletInfoProps) => {
  const { role } = useUserRole();
  const { walletAddress, walletBalance } = useWalletsContext(); // ✅ Using Privy's wallet

  // Generate blockie for user avatar
  const blockieDataUrl = walletAddress
    ? blockies.create({ seed: walletAddress.toLowerCase() }).toDataURL()
    : "";

  return (
    <div className="w-full max-w-md mx-auto p-1 rounded-3xl bg-gradient-to-br from-blue-200 to-blue-500">
      {/* Inner Container with White Background */}
      <div className="bg-white rounded-3xl p-4">
        {/* Card Info Section */}
        <div className="bg-gray-100 rounded-3xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {walletAddress ? (
              <img
                src={blockieDataUrl}
                alt="User Avatar"
                className="w-12 h-12 rounded-3xl"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-3xl"></div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {role === "commuter" ? "Passenger" : "Driver"}
              </p>
              <p className="text-xs text-gray-500">
                {walletAddress
                  ? `${walletAddress.substring(
                      0,
                      6
                    )}...${walletAddress.substring(walletAddress.length - 4)}`
                  : "Not Connected"}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">Balance:</p>
          <h3 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {showZar ? `R ${zarBalance}` : `$ ${walletBalance || "0.00"}`}
          </h3>
        </div>

        {/* Currency Toggle */}
        <div className="flex items-center justify-center space-x-2">
          <span
            className={`text-sm font-medium ${
              !showZar ? "text-gray-900" : "text-gray-400"
            }`}
          >
            cUSD
          </span>
          <div
            onClick={() => setShowZar(!showZar)}
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-all ${
              showZar ? "justify-end" : "justify-start"
            }`}
          >
            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          </div>
          <span
            className={`text-sm font-medium ${
              showZar ? "text-gray-900" : "text-gray-400"
            }`}
          >
            ZAR
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
