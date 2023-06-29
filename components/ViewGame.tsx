import dayjs from "dayjs";
import { useState } from "react";
import PlaceBet from "./PlaceBet";

type Props = {
  game: any;
  markets: any;
};

type marketProps = {
  marketName: string;
  outcomes: any[];
};

type outcomeProps = {
  selectionName: string;
  length: number;
  odds: number;
};

// convert EU odds to US odds, convert to whole integers
const convertOdds = (odds: number) => {
  if (odds >= 2) {
    return `+${parseInt((odds * 100).toString())}`;
  }

  return `-${parseInt((100 / (odds - 1)).toString())}`;
};

const ViewGame = ({ game, markets }: Props) => {
  const startsAt = game.startsAt;
  const participants = game.participants;
  const [selectedOutcome, setSelectedOutcome] = useState(null);

  const handleOutcomeClick = (outcome: any) => {
    setSelectedOutcome(outcome);
  };

  const handleModalClose = () => {
    setSelectedOutcome(null);
  };

  return (
    <>
      <div className="flex flex-col items-center py-6">
        <p className="text-md text-gray-500">
          {dayjs(startsAt * 1000).format("DD MMM HH:mm")}
        </p>
        <p>
          {participants[0].name} vs {participants[1].name}
        </p>
      </div>
      <div className="max-w-[600px] mx-auto space-y-6">
        {markets?.map(({ marketName, outcomes: row }: marketProps) => (
          <div key={marketName} className="">
            <div className="mb-2 font-semibold">{marketName}</div>
            <div className="space-y-1">
              {row.map((outcomes, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-3 w-full">
                    {outcomes.map((outcome: outcomeProps) => (
                      <div
                        key={outcome.selectionName}
                        onClick={() => handleOutcomeClick(outcome)}
                        className="flex justify-between py-2 px-3 cursor-pointer border border-purple-200 rounded-md hover:bg-gray-800 transition"
                        style={{ width: `calc(100% / ${outcomes.length})` }}
                      >
                        <span className="text-gray-500">
                          {outcome.selectionName}
                        </span>
                        <span className="font-medium">
                          {convertOdds(outcome.odds)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {Boolean(selectedOutcome) && (
        <PlaceBet
          game={game}
          outcome={selectedOutcome}
          closeModal={handleModalClose}
        />
      )}
    </>
  );
};

export default ViewGame;
