import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:8000/api',
  },
  staging: {
    apiUrl: 'https://staging-api.moneytransfer.com/api',
  },
  prod: {
    apiUrl: 'https://api.moneytransfer.com/api',
  },
};

const getEnvVars = () => {
//   const releaseChannel = Constants.expoConfig?.extra?.releaseChannel || Constants.manifest?.releaseChannel || 'dev';
  
//   if (releaseChannel === 'production') return ENV.prod;
//   if (releaseChannel === 'staging') return ENV.staging;
  return ENV.dev;
};

export default getEnvVars();
