import axios from "axios";
import { TownRecord, TownRequest } from "@nica-angels/shared";
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

    static async getTown(id: number, token: string) {
        const response = await axios.get<TownRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async editTown(id: number, townRequest: TownRequest, token: string) {
        const response = await axios.put<TownRecord>(
            `${this.baseUrl}/${id}`,
            townRequest,
            getAuthHeader(token)
        );
        return response.data;
    }
}
