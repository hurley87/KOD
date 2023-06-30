import { useEthers } from "@usedapp/core";
import { getMarketName, getSelectionName } from "@azuro-org/dictionaries";
import dayjs from "dayjs";
import useBetsHistory from "@/hooks/useBetsHistory";
import useRedeemBet from "@/hooks/useRedeemBet";
import Layout from "@/components/Layout";
import { convertOdds } from "@/lib/convertOdds";

const BetInfo = ({ data }: { data: any }) => {
  const {
    betId,
    amount,
    potentialPayout,
    status,
    isRedeemed,
    odds,
    createdAt,
    txHash,
    outcome,
  } = data;

  const { redeem, isRedeeming } = useRedeemBet({ betId });

  const isWin = outcome.outcomeId === outcome.condition.wonOutcome?.outcomeId;
  const isResolved = status === "Resolved";
  const isCanceled = status === "Canceled";

  const marketName = getMarketName({ outcomeId: outcome.outcomeId });
  const selectionName = getSelectionName({ outcomeId: outcome.outcomeId });

  return (
    <div className="w-full py-4">
      <div className="text-md text-gray-500 pb-2">
        {dayjs(+createdAt * 1000).format("DD MMMM YYYY")}
      </div>
      <div className="flex flex-wrap gap-x-20 gap-y-6 lg:justify-between">
        <div>
          <div className="text-gray-400">Market</div>
          <div className="mt-1 font-semibold">{marketName}</div>
        </div>
        <div>
          <div className="text-gray-400">Selection</div>
          <div className="mt-1 font-semibold">{selectionName}</div>
        </div>
        <div>
          <div className="text-gray-400">Odds</div>
          <div className="mt-1 font-semibold">{convertOdds(odds)}</div>
        </div>
        <div>
          <div className="text-gray-400">Bet Amount</div>
          <div className="mt-1 font-semibold">
            {+parseFloat(amount).toFixed(2)} USDT
          </div>
        </div>
        <div>
          <div className="text-gray-400">Possible Win</div>
          <div className="mt-1 font-semibold">
            {+parseFloat(potentialPayout).toFixed(2)} USDT
          </div>
        </div>
        <div>
          <div className="text-gray-400">Status</div>
          <div className="mt-1 font-semibold">
            {isResolved ? (
              isWin ? (
                <span className="text-green-600">Win</span>
              ) : (
                <span className="text-red-400">Lose</span>
              )
            ) : isCanceled ? (
              <span className="text-red-700">Canceled</span>
            ) : (
              <span className="text-yellow-500">Pending</span>
            )}
          </div>
        </div>
        {(isWin || isCanceled) && !isRedeemed && (
          <div className="self-center">
            <button className="button" disabled={isRedeeming} onClick={redeem}>
              {isRedeeming ? "Redeeming..." : "Redeem"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BetsHistory() {
  const { account } = useEthers();
  const { loading, data } = useBetsHistory();

  if (!account) {
    return (
      <Layout>
        <div className="mt-6 py-4 text-md text-center bg-red-500 rounded-md">
          Connect your wallet to see your bets history
        </div>
      </Layout>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="">
        {data?.bets.map((bet: any) => (
          <div
            key={bet.id}
            className="justify-items-start border-b-2 border-purple-200 overflow-hidden"
          >
            <BetInfo data={bet} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
