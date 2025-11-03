const cron = require("node-cron");
const { runDiscoveryWorker } = require("./discoveryWorker");

// Executa todos os dias às 10:00
cron.schedule("0 10 * * *", () => {
  runDiscoveryWorker();
});

console.log("🕓 Scheduler iniciado (Discovery Worker rodará diariamente às 10h)");