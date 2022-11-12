(async () => {
    // require('newrelic');
    const app = require("./web-server");
    const worker = require("./worker");
    await Promise.all([app.initialize(), worker.initializeCorrutine(),worker.initializeQueue()]);
})();
  