const ENV = process.env.NODE_ENV;
const ENV_CONFIG = process.env.NODE_CONFIG;

export function getEnv() {
    return ENV;
}

export function getEnvConfig() {
    return ENV_CONFIG;
}
