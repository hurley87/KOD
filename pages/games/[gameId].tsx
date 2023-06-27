import type { NextPage } from "next";
import * as React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const QuizPage: NextPage = () => {
  const [gameId, setGameId] = React.useState<string | undefined>();
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      setGameId(router.query.gameId?.toString());
    }
  }, [router.isReady, router.query]);

  return <Layout>Finishing this next: {gameId}</Layout>;
};

export default QuizPage;