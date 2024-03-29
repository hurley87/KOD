import { getMarketName } from "@azuro-org/dictionaries";
import usePlaceBet from "@/hooks/usePlaceBet";
import { convertOdds } from "@/lib/convertOdds";

type Game = {
  sport: {
    name: string;
  };
  startsAt: number;
  league: {
    country: {
      name: string;
    };
    name: string;
  };
  participants: {
    name: string;
  }[];
};

type OutcomeInfoProps = {
  outcome: any;
};

const OutcomeInfo = ({ outcome }: OutcomeInfoProps) => {
  const marketName = getMarketName({ outcomeId: outcome.outcomeId });

  return (
    <div className="grid lg:grid-cols-[auto_1fr] gap-y-3 mt-2 text-md">
      <span className="text-gray-400">Market</span>
      <span className="text-right font-semibold">{marketName}</span>
      <span className="text-gray-400">Selection</span>
      <span className="text-right font-semibold">{outcome.selectionName}</span>
      <span className="text-gray-400">Odds</span>
      <span className="text-right font-semibold">
        {convertOdds(outcome.odds)}
      </span>
    </div>
  );
};

type PlaceBetProps = {
  game: Game;
  outcome: any;
  closeModal: () => void;
};

const PlaceBet = ({ outcome, closeModal }: PlaceBetProps) => {
  const {
    isRightChain,
    balance,
    amount,
    setAmount,
    isAllowanceFetching,
    isApproveRequired,
    approve,
    isApproving,
    placeBet,
  } = usePlaceBet({ outcome, onBetPlace: closeModal });

  const amountsNode = (
    <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-md text-gray-400">Wallet balance</span>
        <span className="text-md font-semibold">{balance} USDT</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-md text-gray-400">Bet amount</span>
        <input
          className="w-36 py-2 px-4 border border-gray-400 text-md text-right font-semibold rounded-md text-black"
          type="number"
          placeholder="Bet amount"
          disabled={isApproving}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
    </div>
  );

  const button = !isRightChain ? (
    <div className="mt-6 py-2.5 text-center bg-red-400 rounded-md">
      Switch network in your wallet to <b>Polygon</b>
    </div>
  ) : (
    <button
      className="w-full mt-6 py-2.5 text-center bg-primary rounded-md disabled:opacity-70"
      disabled={isAllowanceFetching || isApproving}
      onClick={isApproveRequired ? approve : placeBet}
    >
      {isApproveRequired
        ? isApproving
          ? "Approving..."
          : "Approve"
        : "Place bet"}
    </button>
  );

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
      onClick={closeModal}
    >
      <div
        className="w-[400px] overflow-hidden rounded-xl bg-dark shadow-2xl shadow-primary"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pt-4 px-6 pb-6">
          <OutcomeInfo outcome={outcome} />
          {amountsNode}
          {button}
        </div>
      </div>
    </div>
  );
};

export default PlaceBet;
