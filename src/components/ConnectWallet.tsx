"use client";

import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const handleWalletConnected = async () => {
      if (!isConnected || !address || !chainId || isLoading) return;

      setIsLoading(true);
      setMessage("");
      setMessageType("");

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setMessage("Please log in to connect a wallet");
          setMessageType("error");
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/wallets/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ address, chainId }),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage(result.message || "Wallet connected successfully!");
          setMessageType("success");
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setMessage(result.error || "Failed to connect wallet");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setMessage("Failed to connect wallet");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    handleWalletConnected();
  }, [isConnected, address, chainId, isLoading]);

  return (
    <div className="space-y-4">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
                    >
                      Wrong Network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                    >
                      {chain.hasIcon && chain.iconUrl && (
                        <img
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          className="w-5 h-5 inline mr-2"
                        />
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
          <span className="ml-2 text-gray-400">Saving wallet...</span>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            messageType === "success"
              ? "bg-emerald-900/50 text-emerald-400 border border-emerald-500/30"
              : "bg-red-900/50 text-red-400 border border-red-500/30"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}


