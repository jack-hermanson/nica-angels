import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { auth } from "../middleware/auth";
import { authorized } from "../utils/functions";
import { Clearance } from "@nica-angels/shared";
import { ReportService } from "../services/ReportService";

export const router = Router();

router.get(
    "/students/no-sponsor",
    auth,
    async (req: Request<any>, res: Response) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return undefined;
        }

        res.attachment("report.csv");
        res.type("txt/csv");
        const reportText = await ReportService.getStudentsWithoutSponsors();
        res.send(reportText);
    }
);

router.get(
    "/students/school-and-sponsor",
    auth,
    async (req: Request<any>, res: Response) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return undefined;
        }

        const report = await ReportService.getStudentSchoolSponsorReport();
        res.json(report);
    }
);

router.get(
    "/students/school-and-sponsor-csv",
    auth,
    async (req: Request<any>, res: Response) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return undefined;
        }

        res.attachment("report.csv");
        res.type("txt/csv");
        const reportText = await ReportService.getStudentSchoolSponsorCsv();
        res.send(reportText);
    }
);

router.get(
    "/schools/students-per-grade",
    auth,
    async (req: Request<any>, res: Response<string>) => {
        if (
            !authorized({
                requestingAccount: req.account,
                minClearance: Clearance.ADMIN,
                res,
            })
        ) {
            return undefined;
        }

        const studentsPerGradeCsv = await ReportService.getStudentsPerGradeCsv(
            res
        );
        res.attachment("report.csv");
        res.type("txt/csv");
        res.send(studentsPerGradeCsv);
    }
);
