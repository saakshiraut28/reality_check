/** @format */
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
const Navbar = () => {
  return (
    <>
      <div className="relative z-10 px-8 flex items-center justify-between px-4 py-2 bg-background-yellow border border-4 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] ">
        <div className="text-3xl font-libre font-medium">Be Real.</div>
        <WalletModalProvider>
          <WalletMultiButton />
        </WalletModalProvider>
      </div>
    </>
  );
};

export default Navbar;
