import { Agent } from "https";
import { readFileSync } from "fs";
import axios from "axios";

export function createAxios() {
  const agent = new Agent({
    cert: readFileSync("certs/certificate.pem"),
    key: readFileSync("certs/key.pem"),
    passphrase: "hackaton2023",
  });

  const ax = axios.create({
    headers: {
      "api-version": "2023-01-01",
    },
  });
  ax.defaults.httpsAgent = agent;
  return ax;
}
