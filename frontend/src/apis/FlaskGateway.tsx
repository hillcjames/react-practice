
import axios from "axios";


import { trimEnd, trimStart } from "lodash";
import { lazy } from "../util";

export class FlaskGateway {
    static readonly instance = lazy(() => new FlaskGateway());

    private baseUrl?: string = "http://localhost:5000";


    // private get rootUrl(): string {
    //     if (!this._rootUrl) {
    //         this._rootUrl = trimEnd(this.baseUrl, "/");
    //     }
    //     return this._rootUrl;
    // }

    setBaseUrl(_baseUrl: string): void {
        this.baseUrl = trimEnd(_baseUrl, "/");
    }

    async get<T>(url: string, options: RequestOptions<T> = {}): Promise<Response<T>> {
        try {
            const { params, headers } = options;
            const normalizedUrl = trimStart(url, "/");

            const response = await axios.get(`${this.baseUrl}/${normalizedUrl}`, {
                // withCredentials: true,
                headers,
                params
            });

            return response;
        } catch (ex) {
            console.log(`Error accessing: ${this.baseUrl}/${trimStart(url, "/")} \n: ` + ex);
            // if (ex instanceof AuthenticationError) {
            //     return this.toLogin();
            // } else {
                throw ex;
            // }
        }
    }
    //
    // async post<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
    //     try {
    //         const { params, headers, validate } = options;
    //         const normalizedUrl = trimStart(url, "/");
    //
    //         const response = await axios.post(`${this.rootUrl}/${normalizedUrl}`, data, {
    //             withCredentials: true,
    //             headers,
    //             params
    //         });
    //
    //         if (validate) validate(response.data);
    //
    //         return response;
    //     } catch (ex) {
    //         if (ex instanceof AuthenticationError) {
    //             return this.toLogin();
    //         } else {
    //             throw ex;
    //         }
    //     }
    // }
    //
    // async put<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
    //     try {
    //         const { params, headers, validate } = options;
    //         const normalizedUrl = trimStart(url, "/");
    //
    //         const response = await axios.put(`${this.rootUrl}/${normalizedUrl}`, data, {
    //             withCredentials: true,
    //             headers,
    //             params
    //         });
    //
    //         if (validate) validate(response.data);
    //
    //         return response;
    //     } catch (ex) {
    //         if (ex instanceof AuthenticationError) {
    //             return this.toLogin();
    //         } else {
    //             throw ex;
    //         }
    //     }
    // }
    //
    // async delete<T>(url: string, data?: any, options: RequestOptions<T> = {}): Promise<Response<T>> {
    //     try {
    //         const { params, headers, validate } = options;
    //         const normalizedUrl = trimStart(url, "/");
    //
    //         const response = await axios.delete(`${this.rootUrl}/${normalizedUrl}`, {
    //             withCredentials: true,
    //             headers,
    //             params,
    //             data
    //         });
    //
    //         if (validate) validate(response.data);
    //
    //         return response;
    //     } catch (ex) {
    //         if (ex instanceof AuthenticationError) {
    //             return this.toLogin();
    //         } else {
    //             throw ex;
    //         }
    //     }
    // }

}


export interface RequestOptions<T> {
    params?: any;
    headers?: any;
    // validate?: Validator<T>;
}

export interface Response<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}
