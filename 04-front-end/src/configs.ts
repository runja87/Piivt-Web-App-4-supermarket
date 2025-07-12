import IConfig from "./common/IConfig.interface";
import AuthStore from "./stores/AuthStore";

const DevConfig: IConfig = {
    domain: {
        name: "http://localhost",
        port: 10000,
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

