/** @format */

import React from "react";
import { useAppKit } from "@reown/appkit/react";

const Navbar = () => {
  const { open } = useAppKit();

  return (
    <div className="relative z-10 flex items-center justify-between px-8 py-2 bg-background-yellow border-4 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
      <div className="text-3xl font-libre font-medium">Be Real.</div>
      <div className="flex gap-2">
        <button
          onClick={() => open()}
          className="px-4 py-2 bg-white rounded-md border-2 border-black font-medium hover:bg-gray-100"
        >
          Connect Wallet
        </button>
        <button
          onClick={() => open({ view: "Networks" })}
          className="px-4 py-2 bg-white rounded-md border-2 border-black font-medium hover:bg-gray-100"
        >
          Switch Network
        </button>
      </div>
    </div>
  );
};

export default Navbar;
