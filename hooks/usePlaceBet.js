import { useState } from "react";
import * as ethers from "ethers";
import {
  Polygon,
  useEthers,
  useTokenBalance,
  useTokenAllowance,
  useContractFunction,
  ERC20Interface,
} from "@usedapp/core";
import LP from "./LP.json";

const USDT_DECIMALS = 6;
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const LP_ADDRESS = "0x7043E4e1c4045424858ECBCED80989FeAfC11B36";
const CORE_ADDRESS = "0x3B182e9FbF50398A412d17D7969561E3BfcC4fA4";
const LP_ABI = LP.abi;

const USDTContract = new ethers.Contract(USDT_ADDRESS, ERC20Interface);
const lpContract = new ethers.Contract(LP_ADDRESS, LP_ABI);

export default function usePlaceBet({ outcome, onBetPlace }) {
  const [amount, setAmount] = useState("");
  const { account, chainId } = useEthers();

  const isRightChain = chainId === Polygon.chainId;
  const rawBalance = useTokenBalance(USDT_ADDRESS, account);
  const balance = rawBalance
    ? ethers.utils.formatUnits(rawBalance, USDT_DECIMALS)
    : "0";

  const rawAllowance = useTokenAllowance(USDT_ADDRESS, account, LP_ADDRESS);
  const isAllowanceFetching = rawAllowance === undefined;
  const allowance =
    rawAllowance && ethers.utils.formatUnits(rawAllowance, USDT_DECIMALS);
  const isApproveRequired = +allowance < +amount;

  const { state: approveState, send: _approve } = useContractFunction(
    USDTContract,
    "approve",
    { transactionName: "Approve" }
  );
  const isApproving =
    approveState.status === "PendingSignature" ||
    approveState.status === "Mining";

  const approve = () => {
    // to prevent the need to ask for approval before each bet, the user will be asked to approve a "maximum" amount
    const amount = ethers.constants.MaxUint256;

    _approve(LP_ADDRESS, amount);
  };

  const { send: _placeBet } = useContractFunction(lpContract, "bet", {
    transactionName: "Bet",
  });

  const placeBet = () => {
    const { conditionId, outcomeId, odds } = outcome;

    const slippage = 5; // 5%
    const minOdds = 1 + ((odds - 1) * (100 - slippage)) / 100; // the minimum value at which a bet should be made
    const oddsDecimals = 12; // current protocol version odds has 12 decimals
    const rawMinOdds = ethers.utils.parseUnits(
      minOdds.toFixed(oddsDecimals),
      oddsDecimals
    );
    const rawAmount = ethers.utils.parseUnits(amount, USDT_DECIMALS);
    const deadline = Math.floor(Date.now() / 1000) + 2000;
    const affiliate = "0x1D266998DA65E25DE8e1770d48e0E55DDEE39D24";

    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint64", "uint64"],
      [conditionId, outcomeId, rawMinOdds]
    );

    _placeBet(CORE_ADDRESS, rawAmount, deadline, {
      affiliate,
      data,
    });

    onBetPlace();
  };

  return {
    isRightChain,
    balance,
    amount,
    setAmount,
    isAllowanceFetching,
    isApproveRequired,
    approve,
    isApproving,
    placeBet,
  };
}
