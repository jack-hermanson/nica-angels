import { DateResourceModel } from "jack-hermanson-ts-utils";
import { PaymentMethod } from "../enums";
import { PaymentLogRecord } from "./paymentLog";

export interface PaymentRequest {
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    sponsorshipId: number;
    referenceNumber?: string;
}

export interface PaymentRecord extends DateResourceModel, PaymentRequest {
    paymentLogs?: PaymentLogRecord[];
}
