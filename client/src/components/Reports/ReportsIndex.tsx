import { FunctionComponent } from "react";
import { ActionCardHeader, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import {
    BUTTON_ICON_CLASSES,
    SUBMIT_BUTTON_COLOR,
} from "../../utils/constants";
import { FaDownload } from "react-icons/all";
import { ReportClient } from "../../clients/ReportClient";
import fileDownload from "js-file-download";

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
            <Card>
                <ActionCardHeader
                    title={
                        spanish
                            ? "Estudiantes sin Padrino"
                            : "Students without a Sponsor"
                    }
                />
                <CardBody>
                    <p className="mb-0">
                        {spanish
                            ? "Este reporte incluye cada estudiante sin padrino."
                            : "This report includes every student without a sponsor."}
                    </p>
                    <div className="d-grid col-12 mt-3">
                        <Button
                            color="success"
                            onClick={async () => {
                                if (token) {
                                    await ReportClient.getStudentsWithoutSponsors(
                                        token.data
                                    );
                                }
                            }}
                        >
                            <FaDownload className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Bajar" : "Download"}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }
};
