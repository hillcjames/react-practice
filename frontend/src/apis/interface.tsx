
import { PlanetAPI } from "./PlanetAPI";

export interface Type<T> extends Function {
    // tslint:disable-next-line:callable-types
    new (...args: any[]): T;
}

// export type Validator<T> = (data: unknown) => T;

export interface Gateway {

    get<T>(url: string, options?: RequestOptions<T>): Promise<Response<T>>;
    //
    // post<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;
    //
    // put<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;
    //
    // delete<T>(url: string, data?: any, options?: RequestOptions<T>): Promise<Response<T>>;
}

export function getAPI(): PlanetAPI {
    return PlanetAPI.instance();
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
