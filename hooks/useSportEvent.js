import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { aggregateOutcomesByMarkets } from "@azuro-org/toolkit";

const QUERY = `
  query Game($id: String!) {
    game(id: $id) {
      participants {
        name
      }
      startsAt
      liquidityPool {
        address
      }
      conditions {
        conditionId
        status
        outcomes {
          id
          outcomeId
          odds
        }
        core {
          address
          type
        }
      }
    }
  }
`;

export default function useSportEvent() {
  const { query } = useRouter();
  const id = query.gameId;
  const { loading, data } = useQuery(
    gql`
      ${QUERY}
    `,
    {
      variables: {
        id,
      },
    }
  );

  let game;
  let markets;

  if (data?.game) {
    const { participants, startsAt, liquidityPool, conditions } = data.game;

    game = { participants, startsAt };

    markets = aggregateOutcomesByMarkets({
      lpAddress: liquidityPool.address,
      conditions,
    });
  }

  return {
    loading,
    game,
    markets,
  };
}
