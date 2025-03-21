import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { ProcessPayment } from "@/components/ui/ProcessPayment";
import { usePayments } from "@/hooks/usePayment";
import WalletInfo from "@/components/ui/WalletInfo";
import { GET_PAYMENT_SENT } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/ui/TransactionItem";
import IncentiveHistory from "@/components/ui/IncentiveHistory";
import { useWallets } from "@/context/WalletProvider"; // ✅ Updated import
import FonbnkWidget from "@/components/FonbnkWidget";
import { cUSDContract } from "@/hooks/client";

export default function CommuterPage() {

  const router = useRouter();
  const { address, balance, } = useWallets();
  const { payUser, isLoading } = usePayments();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toggle state to switch between Wallet, Rewards, and Activity views
  const [activeTab, setActiveTab] = useState("wallet");

  const {data,loading: transactionsLoading, error, refetch} = useQuery(GET_PAYMENT_SENT, {
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

  const handleScanSuccess = (scannedData: string) => {
    try {
      const parsedData = JSON.parse(scannedData);
      if (parsedData.recipient && parsedData.amount) {
        setRecipient(parsedData.recipient);
        setAmount(parsedData.amount);
        setIsProcessingComplete(false);
      } else {
        console.warn("Invalid QR code format.");
      }
    } catch (error) {
      console.error("Error parsing scanned data:", error);
    }
  };

  const handlePay = async () => {
    if (!address) {
      console.error("No wallet connected.");
      return;
    }

    setIsProcessing(true);
    try {
      await payUser({
        recipient,
        amount,
        tokenAddress: cUSDContract.address, // ✅ cUSD contract address on Celo
      });

      setIsProcessingComplete(true);
      await refetch();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCancelTransaction = () => {
    setRecipient("");
    setAmount("");
    setIsProcessingComplete(false);
    setIsProcessing(false);
  };

  const zarBalance = conversionRate ? (Number(balance) * conversionRate).toFixed(2) : "Loading...";

  const userTransactions = data?.paymentMades
    ?.filter(
      (transaction: any) =>
        transaction.payer.toLowerCase() === address?.toLowerCase()
    )
    .slice(-5);

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
      {/* Back Button */}
      <div className="w-full flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Tab Navigation */}
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
          <WalletInfo
            showZar={showZar}
            zarBalance={zarBalance}
            setShowZar={setShowZar}
          />
          <div className="w-full max-w-md mt-6 mb-6">
            <ProcessPayment onScanSuccess={handleScanSuccess} />
          </div>
          {recipient && amount && !isProcessingComplete && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex space-x-4">
                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className={`w-1/2 py-3 rounded-lg font-semibold text-white ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 transition duration-200"
                  }`}
                >
                  {isLoading ? "Processing..." : `Pay ${amount} cUSD`}
                </button>
                {!isProcessing && (
                  <button
                    onClick={handleCancelTransaction}
                    className="w-1/2 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md mx-auto mt-6">
          {address && (
            <IncentiveHistory
              address={address}
              showZar={showZar}
              conversionRate={conversionRate}
            />
          )}

          <div className="bg-white p-4 rounded-2xl shadow-sm mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Transactions
              </h3>
            </div>

            {transactionsLoading ? (
              <p className="text-center text-gray-500 py-4">
                Loading transactions...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">
                Error loading transactions: {error.message}
              </p>
            ) : (
              <div>
                {userTransactions.length > 0 ? (
                  userTransactions
                    .slice(0, 5)
                    .map((transaction: any) => (
                      <TransactionItem
                        key={transaction.id}
                        payee={transaction.payee}
                        amount={transaction.amount}
                        blockTimestamp={transaction.blockTimestamp}
                        showZar={showZar}
                        conversionRate={conversionRate}
                      />
                    ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No recent transactions found.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center text-gray-600 text-sm mt-4"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4 mr-2" />
              Refresh Transactions
            </button>
          </div>
        </div>
      )}

      {/* TopUp Section */}
      {activeTab === "TopUp" && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top up your balance
          </h3>
          <FonbnkWidget />
        </div>
      )}
    </div>
  );
}