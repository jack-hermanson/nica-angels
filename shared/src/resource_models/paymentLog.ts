import { ResourceModel } from "jack-hermanson-ts-utils";

export interface PaymentLog extends ResourceModel {
    accountId: number;
    ipAddress: string;
    notes: string;
}
