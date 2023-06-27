import { useEthers } from "@usedapp/core";
import Image from "next/image";
import Link from "next/link";
import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"] });

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();

  // 'account' being undefined means that user is not connected
  const title = account ? formatAddress(account) : "Connect";
  const action = account ? deactivate : activateBrowserWallet;

  return (
    <button className="button" onClick={() => action()}>
      {title}
    </button>
  );
};

type Props = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: Props) => (
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

export default PageLayout;
