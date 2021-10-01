import Conf from "conf";
import prompts from "prompts";

const config = new Conf({
  projectName: "ps-cli",
});

const TOKEN_CONFIG_KEY = "token";

/**
 * Loads the current token
 * @returns {Promise<string>}
 */
export async function loadToken() {
  if (!config.has(TOKEN_CONFIG_KEY)) {
    const { token, shouldSave } = await prompts([
      {
        name: "token",
        type: "password",
        message: "Please provide an API token",
      },
      {
        type: (_, { token }) => (token ? "confirm" : null),
        name: "shouldSave",
        message: "Save token?",
        initial: true,
      },
    ]);

    // End process (user cancelled)
    if (!token) {
      process.exit(0);
    }

    if (!shouldSave) {
      return token;
    }

    config.set(TOKEN_CONFIG_KEY, token);
  }

  return config.get(TOKEN_CONFIG_KEY);
}

export function clearToken() {
  config.delete(TOKEN_CONFIG_KEY);
}
