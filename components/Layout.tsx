import { useEthers, useCall, ERC20Interface } from "@usedapp/core";
import Image from "next/image";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { Contract } from "ethers";
import { useEffect, useState } from "react";

const raleway = Raleway({ subsets: ["latin"] });

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      console.log("account", account);
      const contractAddress = "0xdBb5Da27FFcFeBea8799a5832D4607714fc6aBa8"; // Replace with the ERC-20 token contract address
      const address = account; // Replace with the Ethereum address
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY; // Replace with your PolygonScan API key

      const apiUrl = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;

      console.log(apiUrl);

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log(data);

        const tokenBalance = data.result;

        setBalance(tokenBalance);
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };
    console.log(account);
    if (account) getBalance();
  }, [account]);

  // 'account' being undefined means that user is not connected
  const title = account ? formatAddress(account) : "Connect";
  const action = account ? deactivate : activateBrowserWallet;

  return (
    <button className="button" onClick={() => action()}>
      {title} {account && `| ${balance} $DGEN`}
    </button>
  );
};

type Props = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: Props) => {
  return (
    <div className={raleway.className}>
      <div className="max-w-screen-xl pb-12 mx-auto px-4">
        <nav className="mx-auto w-full flex justify-between py-4">
          <Link href="/">
            <Image alt="KOD logo" width={124} height={32} src="/logo.svg" />
          </Link>
          <ConnectButton />
        </nav>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
