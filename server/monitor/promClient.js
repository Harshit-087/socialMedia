import client from "prom-client";

 const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of requests",
});

