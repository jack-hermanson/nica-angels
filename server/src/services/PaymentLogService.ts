import { getConnection, Repository } from "typeorm";
import { PaymentLog } from "../models/PaymentLog";

export abstract class PaymentLogService {
    private static getRepos(): {
        paymentLogRepo: Repository<PaymentLog>;
    } {
        const connection = getConnection();
        const paymentLogRepo = connection.getRepository(PaymentLog);
        return {
            paymentLogRepo,
        };
    }

    static async getAllFromPayment(paymentId: number): Promise<PaymentLog[]> {
        const { paymentLogRepo } = this.getRepos();
        return await paymentLogRepo.find({
            where: {
                paymentId,
            },
            order: {
                created: "DESC",
            },
        });
    }

    static async getAll(): Promise<PaymentLog[]> {
        const { paymentLogRepo } = this.getRepos();

        return await paymentLogRepo.find({
            order: {
                created: "DESC",
            },
        });
    }

    static async create({
        paymentId,
        accountId,
        ipAddress,
        notes,
    }: {
        paymentId: number;
        accountId: number;
        ipAddress: string;
        notes: string;
    }): Promise<PaymentLog> {
        const { paymentLogRepo } = this.getRepos();

        const paymentLog = new PaymentLog();

        paymentLog.paymentId = paymentId;
        paymentLog.accountId = accountId;
        paymentLog.ipAddress = ipAddress;
        paymentLog.notes = notes;

        return await paymentLogRepo.save(paymentLog);
    }
}
