import type { NextPage } from "next";
import * as React from "react";
import Layout from "../../components/Layout";
import ViewGame from "@/components/ViewGame";
import useSportEvent from "@/hooks/useSportEvent";

const GamePage: NextPage = () => {
  const { loading, game, markets } = useSportEvent();

  if (loading) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <ViewGame game={game} markets={markets} />
    </Layout>
  );
};

export default GamePage;
