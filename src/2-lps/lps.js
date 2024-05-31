const { ethers } = require("ethers");
const { createObjectCsvWriter } = require("csv-writer");

const chains = require("../chains.js");
const abi = require("../../abis/terminal.json");

// Create the .csv file to store depositors
const csvWriterConfig = createObjectCsvWriter({
  path: "lp_depositors.csv",
  header: [
    { id: "chain", title: "CHAIN" },
    { id: "sender", title: "SENDER" },
    { id: "assets", title: "ASSETS" },
    { id: "lp_usd", title: "LP ($USD)" },
  ],
});

async function getLPDepositors(chain, rpc, startBlock, collaterals) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  for (const contractAddress of collaterals) {
    const collateral = new ethers.Contract(contractAddress, abi, provider);
    const depositEventFilter = collateral.filters.Deposit();

    try {
      let events;

      // Separate coz of 10k max block range on zkevm
      if (chain === "zkevm") {
        events = await fetchEventsZKEVM(
          provider,
          collateral,
          depositEventFilter,
          startBlock
        );
      } else {
        events = await collateral.queryFilter(
          depositEventFilter,
          startBlock,
          "latest"
        );
      }

      // get this collateral's lp price
      const lpPrice = await collateral.getLPTokenPrice();

      const records = events.map((event) => ({
        chain,
        sender: event.args.sender,
        assets: ethers.utils.formatUnits(event.args.assets, 18), // LPs are always in 18 decimals
        lp_usd: ethers.utils.formatUnits(
          getLPInUsd(lpPrice, event.args.assets),
          6
        ), // Returns denominated in USDC
      }));

      await csvWriterConfig.writeRecords(records);

      console.log(
        `CSV Record for collateral ${contractAddress} on ${chain} written`
      );
    } catch (error) {
      console.error(
        `Error fetching events for ${contractAddress} on ${chain}:`,
        error
      );
    }
  }
}

// zkEVM can only query for 10k blocks max
async function fetchEventsZKEVM(provider, contract, filter, startBlock) {
  const endBlock = await provider.getBlockNumber();
  const step = 10000;
  const events = [];
  const blockRanges = [];

  for (let i = startBlock; i <= endBlock; i += step) {
    blockRanges.push([i, Math.min(i + step - 1, endBlock)]);
  }

  // Build all queries for `contract`
  const queries = blockRanges.map(async ([fromBlock, toBlock]) => {
    return contract.queryFilter(filter, fromBlock, toBlock);
  });

  const results = await Promise.all(queries);

  results.forEach((query) => events.push(...query));

  return events;
}

function getLPInUsd(lpPrice, amount) {
  return lpPrice.mul(amount).div(BigInt(1e18));
}

(async () => {
  for (const [chain, { rpcUrl, startBlock, collaterals }] of Object.entries(
    chains
  )) {
    if (!rpcUrl) {
      throw new Error(`No RPC defined for ${chain} on .env`);
    }

    await getLPDepositors(chain, rpcUrl, startBlock, collaterals);
  }
})();
