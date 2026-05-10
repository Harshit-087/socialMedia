import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {  
    targets:[                    //Logs are no longer printed to console by default
     {
        target: "pino-loki",             //They go only to Loki
    options: {
      host: "http://localhost:3100", // your Loki URL
      labels: {
        app: "my-backend",
        env: "dev",
      },
      batching: false   
    },
},{
    target:"pino-pretty", // pretty print to console
     options: { colorize: true },
}]
  },
});