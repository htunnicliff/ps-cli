// @ts-check

import chalk from "chalk";
import { oraPromise } from "ora";
import prompts from "prompts";
import { loadToken } from "./load-token.js";
import {
  listMachines,
  startMachine,
  stopMachine,
  waitForMachineState,
} from "./machines.js";

export async function main() {
  // Get API token
  const token = await loadToken();

  // Load machines
  const machines = await oraPromise(listMachines(token), "Loading machines");

  const { machine, operation } = await prompts([
    // Let user select a machine
    {
      type: "select",
      name: "machine",
      message: "Pick a machine",
      choices: machines.map((m) => ({
        title: `${m.name} – ${chalk.gray(m.id)} – ${chalk.yellow(m.state)}`,
        value: m,
      })),
    },
    // Let the user start or stop the machine if possible
    {
      type: (_, { machine: { state } }) =>
        ["off", "ready"].includes(state) ? "confirm" : null,
      name: "operation",
      /** @param {import("./machines.js").Machine} prev */
      message: (_, { machine: { state } }) => {
        return {
          off: "Start this machine?",
          ready: "Stop this machine?",
        }[state];
      },
      initial: true,
    },
  ]);

  if (operation) {
    // Redeclare this variable because of wierd types
    /** @type {import("./machines.js").Machine} */
    const m = machine;
    const { id, state } = m;

    switch (state) {
      case "off":
        await oraPromise(startMachine(id, token), "Starting machine");

        await oraPromise(waitForMachineState(id, "ready", token), {
          text: "Waiting for changes to apply",
          successText: "Machine started",
          failText: "Machine failed to start",
        });
        break;
      case "ready":
        await oraPromise(stopMachine(id, token), "Stopping machine");

        await oraPromise(waitForMachineState(id, "off", token), {
          text: "Waiting for changes to apply",
          successText: "Machine stopped",
          failText: "Machine failed to stop",
        });
        break;
      default:
        throw new Error("No operation for the given state");
    }
  }
}
