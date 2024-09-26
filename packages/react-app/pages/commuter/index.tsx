import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { CommuterUI } from "@/components/CommuterUI";
import { usePayments } from "@/hooks/usePayment";
import { useWallet } from "@/hooks/useWallet";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENT_DATA } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/TransactionItem";
import IncentiveHistory from "@/components/IncentiveHistory"; 

export default function CommuterPage() {
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const { payUser, loading } = usePayments(address);
  const { getUserBalances } = useContractData();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false); // Track payment completion
  const [isProcessing, setIsProcessing] = useState(false); // Track if the pay button is clicked and processing starts

  // Fetch last 5 transactions
  const { data, loading: transactionsLoading, error, refetch } = useQuery(GET_PAYMENT_DATA, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true, // Ensure Apollo re-renders on data change
  });

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserAddress();
      if (address) {
        await getUserBalances(address);
        await getCurrentWalletAmount(address);
        fetchConversionRate();
      }
    };
    fetchUserData();
  }, [address, getCurrentWalletAmount, getUserAddress, getUserBalances]);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      const rate = data.rates.ZAR;
      setConversionRate(rate);
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
        setIsProcessingComplete(false); // Ensure the buttons show again for new transactions
      } else {
        console.warn("Invalid QR code format.");
      }
    } catch (error) {
      console.error("Error parsing scanned data:", error);
    }
  };

  const handlePay = async () => {
    setIsProcessing(true); // Start processing, which hides the cancel button
    try {
      await payUser(recipient, amount); // Await payment completion
      setIsProcessingComplete(true); // Payment completed
      await refetch(); // Refetch transactions after the payment is confirmed
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  const handleCancelTransaction = () => {
    setRecipient("");
    setAmount("");
    setIsProcessingComplete(false); // Reset and show buttons again
    setIsProcessing(false); // Reset processing state
  };

  const zarBalance = conversionRate
    ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
    : "Loading...";

  // Filter transactions made by the current user (commuter)
  const userTransactions = data?.paymentMades
    ?.filter((transaction: any) => transaction.payer.toLowerCase() === address?.toLowerCase())
    .slice(-5); // Limit to last 5 transactions

const handleRefresh = async () => {
await refetch();
}

  return (
    <div className="flex flex-col items-center text-white min-h-screen px-4 py-6 bg-black">
      {/* Back Button */}
      <div className="w-full flex items-center mb-4">
        <button
          onClick={() => history.back()}
          className="flex items-center text-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Wallet Info Section */}
      <WalletInfo
        address={address}
        currentWalletAmount={currentWalletAmount}
        showZar={showZar}
        zarBalance={zarBalance}
        setShowZar={setShowZar}
      />

{address && <IncentiveHistory address={address} showZar={showZar} conversionRate={conversionRate} />}
       

      {/* QR Scanner */}
      <CommuterUI onScanSuccess={handleScanSuccess} />

      {/* Pay and Cancel Buttons */}
      {recipient && amount && !isProcessingComplete && (
        <div className="mt-6 w-full max-w-md">
          <div className="flex space-x-4">
            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className={`w-1/2 p-3 rounded-md text-white font-semibold ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Processing..." : `Pay ${amount} cUSD`}
            </button>

            {/* Cancel Button */}
            {!isProcessing && (
              <button
                onClick={handleCancelTransaction}
                className="w-1/2 p-3 rounded-md text-white font-semibold bg-red-500 hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Previous Transactions Section */}
<div className="w-full max-w-md mt-6">
  <div className="flex justify-between items-center mb-4">
    {/* Header for the Transactions */}
    <h3 className="text-lg text-yellow-400 font-semibold">Previous Transactions</h3>
    {/* Refresh Button */}
    <button onClick={handleRefresh} className="text-gray-400 hover:text-gray-300 transition ease-in-out duration-150">
      <FontAwesomeIcon icon={faSyncAlt} className="w-6 h-6" />
    </button>
  </div>

  {/* Transactions List or Loading/Error States */}
  {transactionsLoading ? (
    <p className="text-gray-200 text-center">Loading transactions...</p>
  ) : error ? (
    <p className="text-red-400 text-center">Error loading transactions: {error.message}</p>
  ) : (
    <div className="bg-gray-500 p-4 rounded-3xl shadow-lg space-y-4">
      {userTransactions.length > 0 ? (
        userTransactions.map((transaction: any) => (
          <TransactionItem
            key={transaction.id}
            payee={transaction.payee}
            amount={transaction.amount}
            blockTimestamp={transaction.blockTimestamp} showZar={showZar} conversionRate={conversionRate}          />
        ))
      ) : (
        <p className="text-gray-200 text-center">No recent transactions found.</p>
      )}
    </div>
  )}
</div>


    </div>
  );
}
