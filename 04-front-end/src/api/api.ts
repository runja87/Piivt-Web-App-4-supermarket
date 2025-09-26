import axios, { AxiosResponse } from 'axios';
import IConfig from '../common/IConfig.interface';
import DevConfig from '../configs';
import AuthStore from '../stores/AuthStore'; 

export type TApiMethod = "get" | "post" | "put" | "delete";
export type TApiResponce = "ok" | "error" | "login";

export interface IApiResponse {
  status: TApiResponce;
  data: any;
}

interface IApiArguments {
  method: TApiMethod;
  path: string;
  data: any | undefined;
  attempthToRefreshToken: boolean;
}

const config: IConfig = DevConfig;
let isRedirectingToLogin = false; 


const API_BASE = `${config.domain.name}:${config.domain.port}`;                 
const REFRESH_ENDPOINT = `${API_BASE}/api/auth/administrator/refresh`;          

let refreshingPromise: Promise<void> | null = null;


async function refreshTokens(): Promise<void> {
  const refreshBearer = config.refresh.token; 
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  
  if (refreshBearer) headers["Authorization"] = refreshBearer;

  const res = await axios.post(
    REFRESH_ENDPOINT,                                                         
    {},
    {
      headers,
    }
  );


  const { authToken, refreshToken } = res.data || {};

  if (!authToken) {
    throw new Error("Refresh response missing authToken");
  }

  if (typeof authToken === "string") {
    AuthStore.dispatch({ type: "update", key: "authToken", value: authToken });
  }
  if (typeof refreshToken === "string" && refreshToken.length > 0) {
    AuthStore.dispatch({ type: "update", key: "refreshToken", value: refreshToken });
  }
}

export function api(
  method: TApiMethod,
  path: string,
  data: any | undefined = undefined,
  attempthToRefreshToken: boolean = true
): Promise<IApiResponse> {
  return new Promise(resolve => {
    const authHeader = config.authorization.token;                              
    axios({
      method,
      baseURL: API_BASE,                                                        
      url: path,
      data,
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })
      .then(res => handleApiResponce(res, resolve))
      .catch(err => handleApiError(err, resolve, { method, path, data, attempthToRefreshToken }));
  });
}

export function apiForm(
  method: TApiMethod,
  path: string,
  data: FormData | undefined,
  attempthToRefreshToken: boolean = true
): Promise<IApiResponse> {
  return new Promise(resolve => {
    axios({
      method,
      baseURL: API_BASE,                                                      
      url: path,
      data,
      headers: {
      
        "Authorization": config.authorization.token, 
      },
    })
      .then(res => handleApiResponce(res, resolve))
      .catch(err => handleApiError(err, resolve, { method, path, data, attempthToRefreshToken }));
  });
}

function handleApiError(
  err: any,
  resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void,
  args: IApiArguments
) {
  if (err?.response) {
    if ((err.response.status === 401 || err.response.status === 403) && args.attempthToRefreshToken) {
      const cfg = err.config || {};
      const isRefreshCall =
        (cfg?.method?.toLowerCase?.() === 'post') &&
        ((cfg.baseURL ? `${cfg.baseURL}${cfg.url}` : cfg.url) === REFRESH_ENDPOINT); 

      if (isRefreshCall) {
        return forceLogin(resolve, 'Session expired. Please log in again.');
      }

      if (!refreshingPromise) {
        refreshingPromise = refreshTokens()
          .catch((e) => {
            throw e;
          })
          .finally(() => {
            refreshingPromise = null;
          });
      }

      refreshingPromise
        .then(() => {
          api(args.method, args.path, args.data, false)
            .then(res => resolve(res))
            .catch(() => forceLogin(resolve, 'Session expired. Please log in again.'));
        })
        .catch(() => forceLogin(resolve, 'Session expired. Please log in again.'));
      return;
    }

    if ((err.response.status === 401 || err.response.status === 403) && !args.attempthToRefreshToken) {
      return forceLogin(resolve, 'You are not logged in!');
    }

    return resolve({
      status: 'error',
      data: err.response.data || `Error: ${err.response.statusText || 'Request failed'}`,
    });
  } else if (err?.request) {
    return resolve({
      status: 'error',
      data: 'No response from the server. Please check your network connection.',
    });
  } else {
    return resolve({
      status: 'error',
      data: 'An error occurred while setting up the request.',
    });
  }
}

function forceLogin(
  resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void,
  message: string
) {
  try {
    AuthStore.dispatch({ type: "update", key: "authToken", value: "" });
    AuthStore.dispatch({ type: "update", key: "refreshToken", value: "" });
    try { localStorage.removeItem("app-auth-store-data"); } catch {}
  } catch {}
  if (!isRedirectingToLogin) {
    isRedirectingToLogin = true;

    window.location.replace("/auth/administrator/login");
  }
  resolve({ status: 'login', data: message });
}

function handleApiResponce(
  res: AxiosResponse<any, any>,
  resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void
) {
  if (res?.status < 200 || res?.status >= 300) {
    return resolve({
      status: 'error',
      data: res.statusText || 'Request failed',
    });
  }
  resolve({
    status: 'ok',
    data: res.data,
  });
}
