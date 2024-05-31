const { ethers } = require("ethers");
const { createObjectCsvWriter } = require("csv-writer");

const chains = require("../chains.js");
const abi = require("../../abis/terminal.json");

// Create the .csv file to store depositors
const csvWriterConfig = createObjectCsvWriter({
  path: "usdc_depositors.csv",
  header: [
    { id: "chain", title: "CHAIN" },
    { id: "sender", title: "SENDER" },
    { id: "assets", title: "ASSETS" },
  ],
});

async function getUsdcDepositors(chain, rpc, startBlock, borrowables) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  for (const contractAddress of borrowables) {
    const borrowable = new ethers.Contract(contractAddress, abi, provider);
    const depositEventFilter = borrowable.filters.Deposit();

    try {
      let events;

      // Separate coz of 10k max block range on zkevm
      if (chain === "zkevm") {
        events = await fetchEventsZKEVM(
          provider,
          borrowable,
          depositEventFilter,
          startBlock
        );
      } else {
        events = await borrowable.queryFilter(
          depositEventFilter,
          startBlock,
          "latest"
        );
      }

      const records = events.map((event) => ({
        chain,
        sender: event.args.sender,
        assets: ethers.utils.formatUnits(event.args.assets, 6),
      }));

      await csvWriterConfig.writeRecords(records);
      console.log(
        `CSV Record for borrowable ${contractAddress} on ${chain} written`
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

(async () => {
  for (const [chain, { rpcUrl, startBlock, borrowables }] of Object.entries(
    chains
  )) {
    if (!rpcUrl) {
      throw new Error(`No RPC defined for ${chain} on .env`);
    }

    await getUsdcDepositors(chain, rpcUrl, startBlock, borrowables);
  }
})();
