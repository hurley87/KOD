import Layout from "@/components/Layout";
import useSportEvents from "@/hooks/useSportEvents";
import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";

type GameCardProps = {
  id: string;
  participants: {
    name: string;

    image: string;
  }[];
  startsAt: number;
};

const GameCard = ({ id, participants, startsAt }: GameCardProps) => (
  <Link
    className="p-4 border border-purple-200 rounded-md hover:bg-gray-800 transition"
    href={`/games/${id}`}
  >
    <p className="text-xs text-gray-400">
      Today · {dayjs(startsAt * 1000).format("HH:mm")}
    </p>
    <div className="mt-1 space-y-1">
      <p className="text-sm">
        {participants[0].name} - {participants[1].name}
      </p>
    </div>
  </Link>
);

const sports = ["Baseball", "MMA"];

export default function Home() {
  const [sport, setSport] = useState<string>("Baseball");
  const { loading, data } = useSportEvents(sport);

  return (
    <Layout>
      {/* list sports as tabs that update sport */}
      <div className="flex space-x-4 mb-8 justify-center">
        {sports.map((sportName) => (
          <button
            key={sportName}
            className={`${
              sport === sportName
                ? "text-primary border-b-2 border-primary"
                : ""
            } text-sm px-4 py-1 text-2xl font-bold`}
            onClick={() => setSport(sportName)}
          >
            {sportName}
          </button>
        ))}
      </div>
      {loading ? (
        <p>loading events...</p>
      ) : (
        <div className="grid lg:grid-cols-1 sm:lg:grid-cols-2 md:lg:grid-cols-3 lg:lg:grid-cols-4 gap-2">
          {data?.games.map((game: any) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      )}
    </Layout>
  );
}
