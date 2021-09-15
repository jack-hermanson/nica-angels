import { getConnection, Repository } from "typeorm";
import { Student } from "../models/Student";

export class StudentService {
    static getRepos(): {
        studentRepo: Repository<Student>;
    } {
        const connection = getConnection();
        const studentRepo = connection.getRepository(Student);
        return { studentRepo };
    }

    static async getAll(): Promise<Student[]> {
        const { studentRepo } = this.getRepos();
        return await studentRepo.find();
    }
}
