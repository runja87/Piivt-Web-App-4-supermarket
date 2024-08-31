import axios, { AxiosResponse } from 'axios';

export type TApiMethod =  "get" | "post" | "put" | "delete";
export type TApiResponce = "ok" | "error" | "login";

export interface IApiResponse{
    status: TApiResponce;
    data: any; 
}

interface IApiArguments{
    method: TApiMethod, path: string, data: any | undefined, attempthToRefreshToken: boolean,
    
}
export function api(method: TApiMethod, path: string, data: any | undefined = undefined, attempthToRefreshToken: boolean = true):Promise<IApiResponse>{
   return new Promise(resolve => {
        axios({
            method: method,
            baseURL: "http://localhost:10000",
            url: path,
            data: data ? JSON.stringify(data) : undefined,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Berrer " + "TOKEN WILL GO HERE LATER",
            },
        })
        .then(res => handleApiResponce(res, resolve))
        .catch(err => handleApiError(err, resolve, { method, path, data, attempthToRefreshToken: false, }));


        });
   }; 
   export function apiForm(method: TApiMethod, path: string, data: FormData, attempthToRefreshToken: boolean = true):Promise<IApiResponse>{
    return new Promise(resolve => {
         axios({
             method: method,
             baseURL: "http://localhost:10000",
             url: path,
             data: data,
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": "Berrer " + "TOKEN WILL GO HERE LATER",
             },
         })
         .then(res => handleApiResponce(res, resolve))
         .catch(err => handleApiError(err, resolve, { method, path, data, attempthToRefreshToken: false, }));
 
 
         });
    }; 

   function handleApiError(err: any, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void, args: IApiArguments){
    
        if(err?.response.status === 401 && args.attempthToRefreshToken){
            const refreshedToken = "REFRESH TOKEN CALL LOGIN WILL GO HERE LATER"; //TOO
            if(refreshedToken){
                api(args.method, args.path, args.data, args.attempthToRefreshToken)
                    .then(res => resolve(res))
                    .catch(() => {
                        resolve({
                            status: 'login',
                            data: 'You must log in again!',
                        });
                    });
                }
                return resolve({
                    status: 'login',
                    data: 'You must log in again!',
                });
            }
            if(err?.response.status === 401 && !args.attempthToRefreshToken){
                return resolve({
                    status: 'login',
                    data: 'You are not logged in!',
                });
   }
   
   }
    function handleApiResponce(res: AxiosResponse<any, any>, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void){
        if(res?.status < 200 || res?.status >= 300){
            return resolve({
                status: 'error',
                data: res + '',
            });
        }
        resolve({
            status: 'ok',
            data: res.data,
        })
    }