import * as qs from "qs";

import { FlaskGateway, Response, RequestOptions } from "./FlaskGateway";
import { lazy } from "../util";

import {
    PlanetGetResponse
} from "../types/PlanetsDTOs";


export class PlanetAPI {
    static readonly instance = lazy(() => new PlanetAPI());
    private readonly gateway: FlaskGateway;

    constructor() {
        this.gateway = FlaskGateway.instance();
    }

    async getPlanets(): Promise<Response<PlanetGetResponse>> {
        return this.gateway.get("planets/");
    }

    async getPlanetById(id: string): Promise<Response<PlanetGetResponse>> {
        return this.gateway.get(`planets/${id}/`);
    }
    //
    // async createPlanet(data: PlanetCreateRequest): Promise<Response<PlanetCreateResponse>> {
    //     const requestData = qs.stringify({
    //         data: JSON.stringify([data])
    //     });
    //
    //     return this.gateway.post("planet/", requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetCreateResponse
    //     });
    // }
    //
    // async updatePlanet(data: PlanetUpdateRequest): Promise<Response<PlanetCreateResponse>> {
    //     const requestData = qs.stringify({
    //         data: JSON.stringify([data])
    //     });
    //
    //     return this.gateway.put(`planet/${data.id}`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetCreateResponse
    //     });
    // }
    //
    // async addPlanetUsers(planetId: string, userIds: number | number[]): Promise<Response<PlanetUpdateUsersResponse>> {
    //     const requestData = qs.stringify({
    //         planet_id: planetId,
    //         data: JSON.stringify(mapIds(userIds)),
    //         tab: "users",
    //         update_action: "add"
    //     });
    //
    //     return this.gateway.put(`planet/${planetId}/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetUpdateUsersResponse
    //     });
    // }
    //
    // async removePlanetUsers(
    //     planetId: string,
    //     userIds: number | number[]
    // ): Promise<Response<PlanetUpdateUsersResponse>> {
    //     const requestData = qs.stringify({
    //         planet_id: planetId,
    //         data: JSON.stringify(mapIds(userIds)),
    //         tab: "users",
    //         update_action: "remove",
    //         _method: "PUT"
    //     });
    //
    //     return this.gateway.put(`planet/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetUpdateUsersResponse
    //     });
    // }
    //
    // async addPlanetGroups(
    //     planetId: string,
    //     groupIds: number | number[]
    // ): Promise<Response<PlanetUpdateGroupsResponse>> {
    //     const requestData = qs.stringify({
    //         planet_id: planetId,
    //         data: JSON.stringify(mapIds(groupIds)),
    //         tab: "groups",
    //         update_action: "add"
    //     });
    //
    //     return this.gateway.put(`planet/${planetId}/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetUpdateGroupsResponse
    //     });
    // }
    //
    // async removePlanetGroups(
    //     planetId: string,
    //     groupIds: number | number[]
    // ): Promise<Response<PlanetUpdateGroupsResponse>> {
    //     const requestData = qs.stringify({
    //         planet_id: planetId,
    //         data: JSON.stringify(mapIds(groupIds)),
    //         tab: "groups",
    //         update_action: "remove"
    //     });
    //
    //     return this.gateway.put(`planet/${planetId}/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetUpdateGroupsResponse
    //     });
    // }
    //
    // async deletePlanet(id: string | string[]): Promise<Response<PlanetDeleteResponse>> {
    //     const requestData = qs.stringify({
    //         _method: "DELETE",
    //         data: JSON.stringify(mapUuids(id))
    //     });
    //
    //     return this.gateway.post("planet/", requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetDeleteResponse
    //     });
    // }
    //
    // async getDependentPlanets(id: string): Promise<Response<PlanetCreateResponse>> {
    //     const requestData = qs.stringify({
    //         ids: id
    //     });
    //
    //     return this.gateway.post("/planetDefinition/dependents", requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetCreateResponse
    //     });
    // }
}

export const planetApi = new PlanetAPI();
