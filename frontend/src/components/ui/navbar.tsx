/** @format */

import "@reown/appkit-wallet-button/react";
import { useWallet } from "@solana/wallet-adapter-react";

const Navbar = () => {
  const { connected } = useWallet();

  return (
    <div className="relative z-10 flex items-center justify-between px-8 py-2 bg-background-yellow border-4 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
      <div className="text-3xl font-libre font-medium">Be Real.</div>
      <div className="flex items-center gap-4">
        {connected && (
          <span className="text-sm font-medium text-green-600">
            Wallet Connected
          </span>
        )}
        <appkit-button />
      </div>
    </div>
  );
};

export default Navbar;
