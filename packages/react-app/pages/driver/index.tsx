// /* eslint-disable @next/next/no-img-element */
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { ReceivePayment } from "@/components/ui/ReceivePayment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
// import WalletInfo from "@/components/ui/WalletInfo";
// import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";
// import { useQuery } from "@apollo/client";
// import { useWallets } from "@/context/WalletProvider";
// import IncentiveHistory from "@/components/ui/IncentiveHistory";
// import TransactionItem from "@/components/ui/TransactionItem";
// import FonbnkWidget from "@/components/FonbnkWidget";

// export default function DriverUIPage() {
//   const router = useRouter();
//   const [amount, setAmount] = useState<string>("");
//   const predefinedAmounts = [0.55, 0.825, 1.1];
//   const {address, balance } = useWallets();
//   const [showZar, setShowZar] = useState(false);
//   const [conversionRate, setConversionRate] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState("wallet"); // Toggle state for the tabs



//   const { data, loading: transactionsLoading, error, refetch } = useQuery(GET_PAYMENTS_RECEIVED, {
//     variables: { address: address },
//     fetchPolicy: "network-only",
//     notifyOnNetworkStatusChange: true,
//   });

//   useEffect(() => {
//     if (address) {
//       fetchConversionRate();
//     }
//   }, [address]);

//   const fetchConversionRate = async () => {
//     try {
//       const response = await fetch("https://open.er-api.com/v6/latest/USD");
//       const data = await response.json();
//       setConversionRate(data.rates.ZAR);
//     } catch (error) {
//       console.error("Error fetching conversion rate:", error);
//     }
//   };

//   const zarBalance = conversionRate
//     ? (Number(balance) * conversionRate).toFixed(2)
//     : "Loading...";

//     const handleRefresh = async () => {
//       await refetch();
//     };

//     const driverTransactions = data?.paymentMades?.slice(-5);

//   return (
//     <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
//     <div className="w-full flex items-center mb-6">
//       <button
//         onClick={() => router.back}
//         className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
//       >
//         <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
//         <span className="text-sm font-medium">Back</span>
//       </button>
//     </div>

//     <div className="w-full max-w-md mb-6">
//       <div className="flex bg-gray-200 rounded-full p-1">
//         <button
//           onClick={() => setActiveTab("wallet")}
//           className={`flex-1 py-2 text-center rounded-full ${
//             activeTab === "wallet" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
//           }`}
//         >
//           Wallet
//         </button>
//         <button
//           onClick={() => setActiveTab("activity")}
//           className={`flex-1 py-2 text-center rounded-full ${
//             activeTab === "activity" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
//           }`}
//         >
//           Activity
//         </button>
//         <button
//           onClick={() => setActiveTab("withdraw")}
//           className={`flex-1 py-2 text-center rounded-full ${
//             activeTab === "withdraw" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
//           }`}
//         >
//           Withdraw
//         </button>
//       </div>
//     </div>

//     {activeTab === "wallet" && (
//       <>
//         <WalletInfo showZar={showZar} zarBalance={zarBalance} setShowZar={setShowZar} />
//         <div className="w-full bg-white p-4 rounded-lg mt-4">
//           <ReceivePayment
//             amount={amount}
//             setAmount={setAmount}
//             predefinedAmounts={predefinedAmounts}
//             address={address || ""}
//             conversionRate={conversionRate || 1}
//             showZar={showZar}
//           />
//         </div>
//       </>
//     )}

//     {activeTab === "activity" && (
//       <div className="w-full max-w-md bg-white p-4 rounded-lg mt-4">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
//         {address && (
//           <IncentiveHistory address={address} showZar={showZar} conversionRate={conversionRate} />
//         )}
//         {transactionsLoading ? (
//           <p className="text-center text-gray-500">Loading transactions...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">Error loading transactions: {error.message}</p>
//         ) : (
//           <div className="space-y-4">
//             {data?.paymentMades?.map((transaction: any) => (
//               <TransactionItem
//                 key={transaction?.id}
//                 payee={transaction?.payee}
//                 amount={transaction?.amount}
//                 blockTimestamp={transaction?.blockTimestamp}
//                 showZar={showZar}
//                 conversionRate={conversionRate}
//               />
//             ))}
//           </div>
//         )}
//         <button onClick={handleRefresh} className="w-full flex items-center justify-center text-gray-600 text-sm mt-4">
//           <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4 mr-2" />
//           Refresh Transactions
//         </button>
//       </div>
//     )}

//     {activeTab === "withdraw" && (
//       <div className="w-full max-w-md">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
//         <FonbnkWidget />
//       </div>
//     )}
//   </div>
//   );
// }


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReceivePayment } from "@/components/ui/ReceivePayment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import WalletInfo from "@/components/ui/WalletInfo";
import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";
import { useQuery } from "@apollo/client";
import { useWallets } from "@/context/WalletProvider";
import IncentiveHistory from "@/components/ui/IncentiveHistory";
import TransactionItem from "@/components/ui/TransactionItem";
import FonbnkWidget from "@/components/FonbnkWidget";

export default function DriverUIPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const predefinedAmounts = [0.55, 0.825, 1.1];
  const { address, balance } = useWallets();
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("wallet");

  const { data, loading: transactionsLoading, error, refetch } = useQuery(GET_PAYMENTS_RECEIVED, {
    variables: { address: address },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (address) {
      fetchConversionRate();
    }
  }, [address]);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      setConversionRate(data.rates.ZAR);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    }
  };

  const zarBalance = conversionRate
    ? (Number(balance) * conversionRate).toFixed(2)
    : "Loading...";

  const handleRefresh = async () => {
    await refetch();
  };

  // Sort transactions by timestamp descending and take the first five
  const driverTransactions = data?.paymentMades
    ? [...data.paymentMades]
        .sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp))
        .slice(0, 5)
    : [];

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
      {/* Back Button */}
      <div className="w-full flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Tab Navigation with Updated Toggle */}
      <div className="w-full max-w-md mb-8">
        <div className="flex bg-gray-200 rounded-full p-1 space-x-1">
          {["wallet", "activity", "TopUp"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center rounded-full ${
                activeTab === tab
                  ? "bg-white text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Section */}
      {activeTab === "wallet" && (
        <>
          <WalletInfo showZar={showZar} zarBalance={zarBalance} setShowZar={setShowZar} />
          <div className="w-full bg-white p-4 rounded-lg mt-4">
            <ReceivePayment
              amount={amount}
              setAmount={setAmount}
              predefinedAmounts={predefinedAmounts}
              address={address || ""}
              conversionRate={conversionRate || 1}
              showZar={showZar}
            />
          </div>
        </>
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
          {address && (
            <IncentiveHistory address={address} showZar={showZar} conversionRate={conversionRate} />
          )}
          {transactionsLoading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading transactions: {error.message}</p>
          ) : (
            <div className="space-y-4">
              {driverTransactions.length > 0 ? (
                driverTransactions.map((transaction: any) => (
                  <TransactionItem
                    key={transaction?.id}
                    payee={transaction?.payee}
                    amount={transaction?.amount}
                    blockTimestamp={transaction?.blockTimestamp}
                    showZar={showZar}
                    conversionRate={conversionRate}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent transactions found.</p>
              )}
            </div>
          )}
          <button onClick={handleRefresh} className="w-full flex items-center justify-center text-gray-600 text-sm mt-4">
            <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4 mr-2" />
            Refresh Transactions
          </button>
        </div>
      )}

      {/* TopUp Section */}
      {activeTab === "TopUp" && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
          <FonbnkWidget />
        </div>
      )}
    </div>
  );
}
