import { FunctionComponent } from "react";
import { ActionCardHeader, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";
import { FaDownload, FaTable } from "react-icons/all";
import { ReportClient } from "../../clients/ReportClient";
import { Link } from "react-router-dom";
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
                        console.log("TODO");
                    }
                }}
            />
        );
    }
};
