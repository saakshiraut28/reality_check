/** @format */

import React, { useEffect, useState } from "react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import idl from "../lib/idl.json";

const programId = new web3.PublicKey(
  "DmydQAoPuv7qKy1fA48JWa5F1B4oHDzJapt5P4u7hyhh"
);

interface UserAccountData {
  owner: web3.PublicKey;
  points: BN;
  selfie_count: BN;
}

export default function DisplayRewards() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [points, setPoints] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    return new AnchorProvider(connection, wallet, { commitment: "processed" });
  };

  const fetchPoints = async () => {
    if (!wallet?.publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const provider = getProvider();
      const program = new Program(idl as any, programId, provider);

      const [userAccount] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), wallet.publicKey.toBuffer()],
        programId
      );

      try {
        const accountInfo = await program.account.userAccount.fetch(
          userAccount
        );
        const userAccountData = accountInfo as any as UserAccountData;
        setPoints(userAccountData.points.toNumber());
      } catch (error) {
        setPoints(0);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
      setError("Failed to fetch points");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();

    // Set up listener for account changes
    if (wallet?.publicKey) {
      const [userAccount] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), wallet.publicKey.toBuffer()],
        programId
      );

      const subscriptionId = connection.onAccountChange(
        userAccount,
        async () => {
          await fetchPoints();
        },
        "confirmed"
      );

      return () => {
        connection.removeAccountChangeListener(subscriptionId);
      };
    }
  }, [wallet?.publicKey, connection]);

  if (!wallet) {
    return (
      <Card className="min-w-screen bg-yellow-50 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] my-4">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">
            Connect your wallet to view points
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-screen bg-yellow-50 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] my-4 font-libre">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          🏆 Your Points 🏆
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <p className="text-center text-gray-600">Loading points...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">{points || 0}</p>
            <p className="text-sm text-gray-600 mt-2">
              Points earned from selfies
            </p>
            <p className="text-xs text-gray-900 mt-4 break-all ">
              Wallet: {wallet.publicKey.toString()}
            </p>
          </div>
        )}
        <p className="text-center text-xl py-4 text-indigo-700 animate-pulse">
          <a href="/capture">Checkout Snaps from your friends ➡️ </a>
        </p>
      </CardContent>
    </Card>
  );
}
