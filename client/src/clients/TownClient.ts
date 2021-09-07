import axios from "axios";
import { TownRecord, TownRequest } from "../../../shared/resource_models/town";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class TownClient {
    static baseUrl = "/api/towns";

    static async getTowns(token: string) {
        const towns = await axios.get<TownRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return towns.data;
    }

    static async createTown(townRequest: TownRequest, token: string) {
        const town = await axios.post<TownRecord>(
            this.baseUrl,
            townRequest,
            getAuthHeader(token)
        );
        return town.data;
    }
}
