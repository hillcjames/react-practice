import * as qs from "qs";

import { FlaskGateway, Response, RequestOptions } from "./FlaskGateway";
import { lazy } from "../util";

import {
    PlanetoidGetResponse
} from "../types/PlanetoidsDTOs";


export class PlanetoidAPI {
    static readonly instance = lazy(() => new PlanetoidAPI());
    private readonly gateway: FlaskGateway;

    constructor() {
        this.gateway = FlaskGateway.instance();
    }

    async getPlanetoids(): Promise<Response<PlanetoidGetResponse>> {
        return this.gateway.get("planetoids/");
    }

    async getPlanetoidById(id: string): Promise<Response<PlanetoidGetResponse>> {
        return this.gateway.get(`planetoids/${id}/`);
    }
    //
    // async createPlanetoid(data: PlanetoidCreateRequest): Promise<Response<PlanetoidCreateResponse>> {
    //     const requestData = qs.stringify({
    //         data: JSON.stringify([data])
    //     });
    //
    //     return this.gateway.post("planetoid/", requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidCreateResponse
    //     });
    // }
    //
    // async updatePlanetoid(data: PlanetoidUpdateRequest): Promise<Response<PlanetoidCreateResponse>> {
    //     const requestData = qs.stringify({
    //         data: JSON.stringify([data])
    //     });
    //
    //     return this.gateway.put(`planetoid/${data.id}`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidCreateResponse
    //     });
    // }
    //
    // async addPlanetoidUsers(planetoidId: string, userIds: number | number[]): Promise<Response<PlanetoidUpdateUsersResponse>> {
    //     const requestData = qs.stringify({
    //         planetoid_id: planetoidId,
    //         data: JSON.stringify(mapIds(userIds)),
    //         tab: "users",
    //         update_action: "add"
    //     });
    //
    //     return this.gateway.put(`planetoid/${planetoidId}/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidUpdateUsersResponse
    //     });
    // }
    //
    // async removePlanetoidUsers(
    //     planetoidId: string,
    //     userIds: number | number[]
    // ): Promise<Response<PlanetoidUpdateUsersResponse>> {
    //     const requestData = qs.stringify({
    //         planetoid_id: planetoidId,
    //         data: JSON.stringify(mapIds(userIds)),
    //         tab: "users",
    //         update_action: "remove",
    //         _method: "PUT"
    //     });
    //
    //     return this.gateway.put(`planetoid/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidUpdateUsersResponse
    //     });
    // }
    //
    // async addPlanetoidGroups(
    //     planetoidId: string,
    //     groupIds: number | number[]
    // ): Promise<Response<PlanetoidUpdateGroupsResponse>> {
    //     const requestData = qs.stringify({
    //         planetoid_id: planetoidId,
    //         data: JSON.stringify(mapIds(groupIds)),
    //         tab: "groups",
    //         update_action: "add"
    //     });
    //
    //     return this.gateway.put(`planetoid/${planetoidId}/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidUpdateGroupsResponse
    //     });
    // }
    //
    // async removePlanetoidGroups(
    //     planetoidId: string,
    //     groupIds: number | number[]
    // ): Promise<Response<PlanetoidUpdateGroupsResponse>> {
    //     const requestData = qs.stringify({
    //         planetoid_id: planetoidId,
    //         data: JSON.stringify(mapIds(groupIds)),
    //         tab: "groups",
    //         update_action: "remove"
    //     });
    //
    //     return this.gateway.put(`planetoid/${planetoidId}/`, requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidUpdateGroupsResponse
    //     });
    // }
    //
    // async deletePlanetoid(id: string | string[]): Promise<Response<PlanetoidDeleteResponse>> {
    //     const requestData = qs.stringify({
    //         _method: "DELETE",
    //         data: JSON.stringify(mapUuids(id))
    //     });
    //
    //     return this.gateway.post("planetoid/", requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidDeleteResponse
    //     });
    // }
    //
    // async getDependentPlanetoids(id: string): Promise<Response<PlanetoidCreateResponse>> {
    //     const requestData = qs.stringify({
    //         ids: id
    //     });
    //
    //     return this.gateway.post("/planetoidDefinition/dependents", requestData, {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         validate: validatePlanetoidCreateResponse
    //     });
    // }
}

export const planetoidApi = new PlanetoidAPI();
