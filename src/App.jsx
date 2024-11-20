import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const { address: connectedAddress } = useAccount();

  async function getTokenBalance() {
    setLoading(true);
    setError(null);
    try {
      const config = {
        apiKey: "JeO4MHx99fjG52tZ2ThURpt4DiWR_zYD",
        network: Network.ETH_MAINNET,
      };

      const alchemy = new Alchemy(config);
      const data = await alchemy.core.getTokenBalances(connectedAddress);

      setResults(data);

      const tokenDataPromises = data.tokenBalances.map((token) =>
        alchemy.core.getTokenMetadata(token.contractAddress)
      );

      setTokenDataObjects(await Promise.all(tokenDataPromises));
      setHasQueried(true);
    } catch (err) {
      setError("Failed to fetch token balances");
      toast({
        title: "Error",
        description: "Failed to fetch token balances",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <RainbowKitProvider>
      <Center
        flexDirection={"column"}
        margin={"auto"}
        minHeight={"screen"}
        width={"100%"}
      >
        <ConnectButton />
        <Center>
          <Flex
            alignItems={"center"}
            justifyContent="center"
            flexDirection={"column"}
            textAlign="center"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <Heading mb={4} fontSize={36}>
              ERC-20 Token Indexer
            </Heading>
            <Text mb={2}>Connected Wallet Address: {connectedAddress}</Text>
            <Text mb={4}>
              Plug in an address and this website will return all of its ERC-20
              token balances!
            </Text>
          </Flex>
        </Center>
        {connectedAddress && (
          <Flex
            w="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent={"center"}
            mt={8}
          >
            <Heading mt={8} mb={4}>
              Get all the ERC-20 token balances of this address:
            </Heading>
            <Text
              color="black"
              w="600px"
              textAlign="center"
              p={4}
              bgColor="white"
              fontSize={24}
              borderRadius="md"
              boxShadow="md"
            >
              {connectedAddress}
            </Text>
            <Button
              fontSize={20}
              onClick={getTokenBalance}
              mt={8}
              bgColor="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check ERC-20 Token Balances"}
            </Button>

            <Heading my={8}>ERC-20 token balances:</Heading>
            {loading && <Text>Loading...</Text>}
            {error && <Text color="red.500">{error}</Text>}
            {hasQueried && !loading && !error && (
              <SimpleGrid w={"90vw"} columns={[1, 2, 3, 4]} spacing={8}>
                {results.tokenBalances.map((e, i) => (
                  <Flex
                    flexDir={"column"}
                    color="white"
                    bg="blue.500"
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    key={e.id}
                  >
                    <Box>
                      <b>Symbol:</b> {tokenDataObjects[i].symbol}
                    </Box>
                    <Box>
                      <b>Balance:</b>{" "}
                      {Utils.formatUnits(
                        e.tokenBalance,
                        tokenDataObjects[i].decimals
                      )}
                    </Box>
                    <Image src={tokenDataObjects[i].logo} alt="Token Logo" />
                  </Flex>
                ))}
              </SimpleGrid>
            )}
          </Flex>
        )}
      </Center>
    </RainbowKitProvider>
  );
}

export default App;
