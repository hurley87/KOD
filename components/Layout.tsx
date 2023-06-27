import { useEthers } from "@usedapp/core";
import Image from "next/image";

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
  <div className="container pb-12 mx-auto">
    <nav className="max-w-screen-xl mx-auto w-full flex justify-between py-4">
      <Image alt="KOD logo" width={124} height={32} src="/logo.svg" />
      <ConnectButton />
    </nav>
    {children}
  </div>
);

export default PageLayout;
