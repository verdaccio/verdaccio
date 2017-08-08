/**
 * Parses a user agent string for NPM metadata.
 * @param {string} userAgent 
 * @return {{npmVersion: string, nodeVersion: string, platform: string, architecture: string}}
 */
const npmUserAgentParser = (userAgent) => {
  /*
  An NPM user agent takes the following format:
  npm/NPM_VERSION node/vNODE_VERSION PLATFORM ARCHITECTURE

  Any other format is unsupported.
  */
  if (!userAgent || typeof userAgent !== 'string') {
    return undefined;
  }

  const userAgentComponents = userAgent.split(' ');
  if (userAgentComponents.length < 4) {
    return undefined;
  }

  const npmComponent = userAgentComponents[0];
  const nodeComponent = userAgentComponents[1];
  const platform = userAgentComponents[2];
  const architecture = userAgentComponents[3];

  const npmVersion = npmComponent.replace('npm/', '');
  const nodeVersion = nodeComponent.replace('node/v', '');

  return {
    npmVersion,
    nodeVersion,
    platform,
    architecture,
  };
};

module.exports = npmUserAgentParser;
