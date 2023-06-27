import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as ethers from "ethers";
import { DAppProvider, Polygon } from "@usedapp/core";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-polygon",
  cache: new InMemoryCache(),
});

const config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    // in this tutorial we use Ankr public RPC. It's free and has it's own limits
    // in the production version with a large number of users, we do not recommend using it
    [Polygon.chainId]: new ethers.providers.StaticJsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/jK4-vdS0dkLK8tVg7VtF-91-Px93zbkd"
    ),
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </DAppProvider>
  );
}
