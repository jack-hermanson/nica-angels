import { FunctionComponent, useEffect, useState } from "react";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, StudentSchoolSponsor } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { ReportClient } from "../../clients/ReportClient";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Col, Row, Table } from "reactstrap";
import { ReportActions } from "./ReportActions";

export const StudentsWithSchoolAndSponsor: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [records, setRecords] = useState<StudentSchoolSponsor[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            ReportClient.getStudentSchoolSponsorReport(token.data).then(
                data => {
                    setRecords(data);
                }
            );
        }
    }, [token, setRecords]);

    return (
        <div>
            {renderPageHeader()}
            {renderTable()}
        </div>
    );

    function renderPageHeader() {
        const title = spanish
            ? "Estudiantes con Escuela y Padrino"
            : "Students with School and Sponsor";
        return (
            <Row>
                <Col>
                    <PageHeader title={title}>
                        <ReportActions
                            title={title}
                            downloadReport={downloadReport}
                        />
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderTable() {
        return (
            <Row>
                <Col>
                    {records ? (
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>School</th>
                                    <th>Sponsor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(record => (
                                    <tr key={record.student.id}>
                                        <td>{record.student.id}</td>
                                        <td>
                                            {record.student.firstName}{" "}
                                            {record.student.middleName || ""}{" "}
                                            {record.student.lastName || ""}
                                        </td>
                                        <td>{record.schoolName}</td>
                                        <td>{record.sponsorName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    async function downloadReport() {
        // todo
        console.log("download report");
    }
};
