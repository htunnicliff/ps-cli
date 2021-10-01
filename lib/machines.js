import execa from "execa";

/**
 * @typedef {"off" | "ready" | "starting" | "stopping"} MachineState
 */

/**
 *
 * @param {string} machineId
 * @param {string} token
 */
export async function status(machineId, token) {
  const { stdout } = await execa("paperspace", [
    "machines",
    "show",
    `--apiKey="${token}"`,
    `--machineId="${machineId}"`,
  ]);

  return stdout;
}

/**
 * @typedef {Object} Machine
 * @property {string} id
 * @property {string} name
 * @property {string} os
 * @property {string} ram
 * @property {number} cpus
 * @property {string} gpu
 * @property {string} storageTotal
 * @property {string} storageUsed
 * @property {string} usageRate
 * @property {number} shutdownTimeoutInHours
 * @property {boolean} shutdownTimeoutForces
 * @property {boolean} performAutoSnapshot
 * @property {string | null} autoSnapshotFrequency
 * @property {string | null} autoSnapshotSaveCount
 * @property {boolean} dynamicPublicIp
 * @property {string} agentType
 * @property {string} dtCreated
 * @property {MachineState} state
 * @property {boolean} updatesPending
 * @property {string} networkId
 * @property {string} privateIpAddress
 * @property {string | null} publicIpAddress
 * @property {string} region
 * @property {string | null} scriptId
 * @property {string | null} dtLastRun
 * @property {string | null} restorePointSnapshotId
 * @property {string | null} restorePointFrequency
 * @property {number} internalId
 */

/**
 * List machines
 * @param {string} token
 * @returns {Promise<Machine[]>}
 */
export async function listMachines(token) {
  const { stdout } = await execa("paperspace", [
    "machines",
    "list",
    `--apiKey="${token}"`,
  ]);

  return JSON.parse(stdout);
}

/**
 * Start a machine
 * @param {string} machineId
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function startMachine(machineId, token) {
  const { stdout } = await execa("paperspace", [
    "machines",
    "start",
    "--apiKey",
    token,
    "--machineId",
    machineId,
  ]);

  return JSON.parse(stdout);
}

/**
 * Stop a machine
 * @param {string} machineId
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function stopMachine(machineId, token) {
  const { stdout } = await execa("paperspace", [
    "machines",
    "stop",
    "--apiKey",
    token,
    "--machineId",
    machineId,
  ]);

  return JSON.parse(stdout);
}

/**
 * Wait for a machine to enter a given state
 * @param {string} machineId
 * @param {MachineState} state
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function waitForMachineState(machineId, state, token) {
  const { stdout } = await execa("paperspace", [
    "machines",
    "waitfor",
    "--apiKey",
    token,
    "--machineId",
    machineId,
    "--state",
    state,
  ]);

  return JSON.parse(stdout);
}
