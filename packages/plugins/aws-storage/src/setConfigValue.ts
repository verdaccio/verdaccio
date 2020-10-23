export default (configValue: any): string => {
  const envValue = process.env[configValue];
  return envValue || configValue;
};
