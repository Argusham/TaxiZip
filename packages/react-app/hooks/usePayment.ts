// // hooks/usePayments.ts

// import { useState } from "react";
// import { parseEther, encodeFunctionData } from "viem";
// import { useWalletClient, useAccount } from "wagmi";
// import erc20Abi from "../utils/erc20Abi.json"; 
// import cusdAbi from "../utils/cusdAbi.json";
// import { publicClient } from "../utils/publicClient"; 

// export const usePayments = (walletAddress: string | null) => {
//   const [loading, setLoading] = useState(false);
//   const taxiPaymentContractAddress = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
//   const cusdTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";

//   // Wagmi
//   const { data: walletClient } = useWalletClient();
//   const { address, isConnected } = useAccount();

//   // Approve cUSD spending
//   const approveCUSDSpending = async (spender: string, amount: string) => {
//     if (!walletClient || !address) {
//       console.error("No wallet client or address connected.");
//       return false;
//     }
//     try {
//       const amountInWei = parseEther(amount);
//       const txHash = await walletClient.writeContract({
//         address: cusdTokenAddress,
//         abi: erc20Abi,
//         functionName: "approve",
//         account: address,
//         args: [spender, amountInWei],
//       });

//       await publicClient.waitForTransactionReceipt({ hash: txHash });
//       return true;
//     } catch (error) {
//       console.error("Approval failed:", error);
//       return false;
//     }
//   };

//   // Pay a user
//   const payUser = async (recipient: string, amount: string) => {
//     if (!walletClient || !address) {
//       console.error("No wallet client or address connected.");
//       return;
//     }
//     try {
//       setLoading(true);

//       // Ensure approval
//       const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
//       if (!approved) {
//         console.error("Payment halted: Approval failed.");
//         setLoading(false);
//         return;
//       }

//       const amountInWei = parseEther(amount);
//       const callData = encodeFunctionData({
//         abi: cusdAbi,
//         functionName: "payUser",
//         args: [recipient, amountInWei],
//       });

//       // Estimate gas
//       const gasEstimate = await publicClient.estimateGas({
//         account: address,
//         to: taxiPaymentContractAddress,
//         data: callData,
//       });

//       // Execute payment
//       const txHash = await walletClient.writeContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "payUser",
//         account: address,
//         args: [recipient, amountInWei],
//         gas: gasEstimate,
//       });

//       await publicClient.waitForTransactionReceipt({ hash: txHash });
//       setLoading(false);
//       return txHash;
//     } catch (error) {
//       console.error("Payment failed:", error);
//       setLoading(false);
//     }
//   };

//   return {
//     payUser,
//     loading,
//   };
// };


// usePayments.ts
import { useState } from 'react';
import { useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall, prepareTransaction } from 'thirdweb';
import { Chain, celo } from 'thirdweb/chains';   // import the chain you're using (e.g. mainnet, polygon, sepolia, etc.)
import { client } from "../hooks/client";            // import your configured Thirdweb client instance

// Define the shape of a payment request for clarity and type safety
interface PaymentRequest {
  recipient: string;        // address to send funds to (could be a contract or wallet address)
  amount: string | bigint;  // amount to send (in wei or the smallest token unit)
  tokenAddress?: string;    // ERC-20 token contract address if using a token; if omitted, native currency is assumed
  // You can add other fields like invoiceId or payment reference if needed
}

export function usePayments(defaultChain: Chain = celo) {
  // Local state
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<Error | null>(null);

  // Thirdweb hook for sending transactions
  const { mutateAsync: sendTransaction, isPending: isSending, error: sendError, data: txResult } = useSendTransaction();

  // Function to initiate a payment
  const sendPayment = async ({ recipient, amount, tokenAddress }: PaymentRequest) => {
    try {
      setPrepareError(null);
      setIsPreparing(true);

      let preparedTx;
      const amountInWei = BigInt(amount); // ✅ Ensure amount is in `bigint` format

      if (tokenAddress) {
        // **Token payment (cUSD or other ERC-20)**
        const tokenContract = getContract({
          address: tokenAddress,
          chain: defaultChain,
          client: client,
        });

        preparedTx = await prepareContractCall({
          contract: tokenContract,
          method: "function transfer(address to, uint256 amount)",
          params: [recipient, amountInWei],
        });
      } else {
        // **Native currency payment (e.g., CELO)**
        preparedTx = await prepareTransaction({
          to: recipient,
          value: amountInWei,
          chain: defaultChain,
          client: client,
        });
      }

      // Execute transaction using Thirdweb's mutation hook
      await sendTransaction(preparedTx);

    } catch (err) {
      console.error("Payment failed:", err);
      setPrepareError(err as Error);
    } finally {
      setIsPreparing(false);
    }
  };

  return {
    sendPayment,
    isLoading: isPreparing || isSending, // ✅ Uses `isPending` instead of `isLoading`
    error: prepareError || sendError || null,
    transactionResult: txResult, // ✅ Transaction result (e.g., hash)
  };
}