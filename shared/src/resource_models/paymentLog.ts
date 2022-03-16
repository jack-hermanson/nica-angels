import { ResourceModel } from "jack-hermanson-ts-utils";

export interface PaymentLogRecord extends ResourceModel {
    accountId: number;
    paymentId: number;
    ipAddress: string;
    notes: string;
}
