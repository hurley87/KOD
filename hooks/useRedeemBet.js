import * as ethers from "ethers";
import { useContractFunction } from "@usedapp/core";
import LP from "./LP.json";

const LP_ADDRESS = "0x7043E4e1c4045424858ECBCED80989FeAfC11B36";
const CORE_ADDRESS = "0x3B182e9FbF50398A412d17D7969561E3BfcC4fA4";

const LP_ABI = LP.abi;
const lpContract = new ethers.Contract(LP_ADDRESS, LP_ABI);

export default function useRedeemBet({ betId }) {
  const { state, send } = useContractFunction(lpContract, "withdrawPayout", {
    transactionName: "Approve",
  });

  const redeem = () => {
    send(CORE_ADDRESS, betId, false);
  };

  return {
    redeem,
    isRedeeming:
      state.status === "PendingSignature" || state.status === "Mining",
  };
}
