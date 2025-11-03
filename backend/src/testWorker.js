const { runDiscoveryWorker } = require("./workers/discoveryWorker");

(async () => {
  await runDiscoveryWorker();
  process.exit(0);
})();
