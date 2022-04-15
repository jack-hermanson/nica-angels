import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { Col, Row } from "reactstrap";
import { ReportClient } from "../../clients/ReportClient";
import { ReportTile } from "./ReportTile";

export const ReportsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            {renderPageHeader()}
            <Row>
                <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                    {renderNoSponsorReport()}
                </Col>
                <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                    {renderStudentsSchoolSponsorReport()}
                </Col>
                <Col xs={12} lg={4}>
                    {renderStudentsPerGradeReport()}
                </Col>
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Reportes" : "Reports"} />
                </Col>
            </Row>
        );
    }

    function renderNoSponsorReport() {
        return (
            <ReportTile
                title={
                    spanish
                        ? "Estudiantes sin Padrino"
                        : "Students without a Sponsor"
                }
                description={
                    spanish
                        ? "Este reporte incluye cada estudiante sin padrino."
                        : "This report includes every student without a sponsor."
                }
                linkPath={"/reports/students/no-sponsor"}
                downloadCsv={async () => {
                    if (token) {
                        await ReportClient.getStudentsWithoutSponsors(
                            token.data
                        );
                    }
                }}
            />
        );
    }

    function renderStudentsSchoolSponsorReport() {
        return (
            <ReportTile
                title={
                    spanish
                        ? "Estudiantes con Escuela y Padrino"
                        : "Students with School and Sponsor"
                }
                description={
                    spanish
                        ? "Este reporte incluye cada estudiante y su escuela y padrino."
                        : "This report includes each student and his/her school and sponsor."
                }
                linkPath={"/reports/students/school-and-sponsor"}
                downloadCsv={async () => {
                    if (token) {
                        await ReportClient.getStudentSchoolSponsorCsv(
                            token.data
                        );
                    }
                }}
            />
        );
    }

    function renderStudentsPerGradeReport() {
        return (
            <ReportTile
                title={spanish ? "Estudiantes por Nivel" : "Students per Grade"}
                description={
                    spanish
                        ? "Este reporte incluye números de estudiantes inscritos en cada escuela."
                        : "This report includes numbers of students enrolled in each school."
                }
                linkPath={"/reports/schools/students-per-grade"}
                downloadCsv={async () => {
                    if (token) {
                        console.log("download csv");
                    }
                }}
            />
        );
    }
};
