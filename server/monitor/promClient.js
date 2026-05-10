import client from "prom-client";

export const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of requests",
});

