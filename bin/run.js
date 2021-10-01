#!/usr/bin/env node

import meow from "meow";
import { clearToken } from "../lib/load-token.js";
import { main } from "../lib/main.js";

const cli = meow(
  `
  Usage
    $ ps-cli

  Options
    --clear-token   Clear cached API token
`,
  {
    importMeta: import.meta,
    flags: {
      clearToken: {
        type: "boolean",
        isRequired: false,
      },
    },
  }
);

if (cli.flags.clearToken) {
  clearToken();
  console.log("Token cleared");
} else {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
