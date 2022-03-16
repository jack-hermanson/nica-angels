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

    static async getAllFromPayment(paymentId: number) {
        const { paymentLogRepo } = this.getRepos();
        const paymentLogs = await paymentLogRepo.find({
            where: {},
        });
    }
}
