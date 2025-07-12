import { configureStore } from "@reduxjs/toolkit";

export interface IAuthStoreData {
    role: "user" | "administrator";
    identity: string;
    id: number;
    authToken: string;
    refreshToken: string;
}


const DefaultAuthStoreData: IAuthStoreData = {
    role: "user",
    identity: "visitor",
    id: 0,
    authToken: "",
    refreshToken: "",
}

let InitialAuthStoreData: IAuthStoreData = DefaultAuthStoreData;


(() => {
    const storedDataString = localStorage.getItem("app-auth-store-data");
    if (!storedDataString) {
        return;
    }

    try {
        const storedData = (JSON.parse(storedDataString) ?? "{}");
        if (typeof storedData === "object" && storedData !== null &&
            "authToken" in storedData &&
            "refreshToken" in storedData) {
            InitialAuthStoreData = { ...DefaultAuthStoreData, ...storedData };
        } else {
            console.warn("Invalid stored data structure:", storedData);
        }
    } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        localStorage.removeItem("app-auth-store-data");
    }
})();

type TUpdateRole = { type: "update"; key: "role"; value: "user" | "administrator" };
type TUpdateId = { type: "update"; key: "id"; value: number };
type TUpdateStrings = { type: "update"; key: "identity" | "authToken" | "refreshToken"; value: string };
type TReset = { type: "reset" };

type TAuthStoreAction = TUpdateRole | TUpdateId | TUpdateStrings | TReset;

function AuthStoreReducer(oldState: IAuthStoreData = InitialAuthStoreData, action: TAuthStoreAction): IAuthStoreData {
    switch (action.type) {
        case "update":
            return { ...oldState, [action.key]: action.value };
        case "reset":
            return { ...DefaultAuthStoreData };
        default:
            return { ...oldState };
    }
}

const AuthStore = configureStore({
    reducer: AuthStoreReducer,
    preloadedState: InitialAuthStoreData,
});

AuthStore.subscribe(() => {
    try {
        const state = AuthStore.getState();
        localStorage.setItem("app-auth-store-data", JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save auth data:", error);
    }
});

export type TAuthStoreDispatch = typeof AuthStore.dispatch;
export default AuthStore;