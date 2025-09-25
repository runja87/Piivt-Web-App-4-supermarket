import AuthStore from "./stores/AuthStore";
import IConfig from "./common/IConfig.interface";

const DevConfig: IConfig = {
  domain: {
    name: process.env.REACT_APP_API_DOMAIN || "http://localhost",
    port: Number(process.env.REACT_APP_API_PORT || 10000),
  },
  authorization: {
    get token() {
      return `Bearer ${AuthStore.getState().authToken}`;
    },
  },
  refresh: {
    get token() {
      return `Bearer ${AuthStore.getState().refreshToken}`;
    },
  },
};

export default DevConfig;
