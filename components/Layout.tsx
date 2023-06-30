import { useEthers, useTokenBalance } from "@usedapp/core";
import Image from "next/image";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useState } from "react";

const raleway = Raleway({ subsets: ["latin"] });

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

type Props = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const balance = useTokenBalance(
    "0xdBb5Da27FFcFeBea8799a5832D4607714fc6aBa8",
    account
  );

  return (
    <div className={raleway.className}>
      <div className="max-w-screen-xl pb-12 mx-auto px-4">
        <nav className="mx-auto w-full flex justify-between py-4">
          <Link href="/">
            <Image alt="KOD logo" width={124} height={32} src="/logo.svg" />
          </Link>
          <div className="relative ml-3">
            {account ? (
              <button
                onClick={() => setShowMenu(!showMenu)}
                type="button"
                className="flex rounded-full bg-gray-800 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {formatAddress(account)} {account && `| ${balance || 0} $DGEN`}
              </button>
            ) : (
              <button
                onClick={activateBrowserWallet}
                type="button"
                className="flex rounded-full bg-gray-800 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Connect
              </button>
            )}

            {showMenu && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-gray-800 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link
                  href="/bets"
                  className="block px-4 py-2 text-sm text-gray-200"
                >
                  My Bets
                </Link>
                <span
                  onClick={() => {
                    deactivate();
                    setShowMenu(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-200 cursor-pointer"
                >
                  Disconnect
                </span>
              </div>
            )}
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
