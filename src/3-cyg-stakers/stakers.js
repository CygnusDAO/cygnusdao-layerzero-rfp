const { ethers } = require("ethers");
const { createObjectCsvWriter } = require("csv-writer");

const chains = require("../chains.js");
const abi = require("../../abis/x1vault.json");

const csvWriterConfig = createObjectCsvWriter({
  path: "cyg_stakers.csv",
  header: [
    { id: "chain", title: "CHAIN" },
    { id: "staker", title: "STAKER" },
    { id: "amount", title: "AMOUNT" },
  ],
});

async function getVaultStakers(chain, rpc, startBlock, vaultAddress) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const vault = new ethers.Contract(vaultAddress, abi, provider);
  const depositEventFilter = vault.filters.Deposit();

  try {
    const events = await vault.queryFilter(depositEventFilter);

    const records = events.map((event) => ({
      chain,
      staker: event.args.user,
      amount: ethers.utils.formatUnits(event.args.amount, 18),
    }));

    await csvWriterConfig.writeRecords(records);
  } catch (error) {
    console.error(
      `Error fetching events for ${vaultAddress} on ${chain}:`,
      error
    );
  }
}

(async () => {
  for (const [chain, { rpcUrl, startBlock, vault }] of Object.entries(chains)) {
    // Don't do zkevm since vault is not fully deployed there yet
    if (!vault) continue;

    if (!rpcUrl) {
      throw new Error(`No RPC defined for ${chain} on .env`);
    }

    await getVaultStakers(chain, rpcUrl, startBlock, vault);
  }
})();
