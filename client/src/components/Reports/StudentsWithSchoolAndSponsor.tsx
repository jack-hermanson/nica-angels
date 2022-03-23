import { FunctionComponent, useEffect, useState } from "react";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    getAge,
    sexToString,
    StudentSchoolSponsor,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { ReportClient } from "../../clients/ReportClient";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Col, Row, Table } from "reactstrap";
import { ReportActions } from "./ReportActions";
import { TrueFalseIcon } from "../Utils/TrueFalseIcon";

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
                                    <th>Level</th>
                                    <th>Age</th>
                                    <th>Sex</th>
                                    <th>Uniform</th>
                                    <th>Backpack</th>
                                    <th>Shoes</th>
                                    <th>Supplies</th>
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
                                        <td>{record.student.level}</td>
                                        <td>{getAge(record.student)}</td>
                                        <td>
                                            {sexToString(record.student.sex)}
                                        </td>
                                        <td>
                                            <TrueFalseIcon
                                                value={record.student.uniform}
                                            />
                                        </td>
                                        <td>
                                            <TrueFalseIcon
                                                value={record.student.backpack}
                                            />
                                        </td>
                                        <td>
                                            <TrueFalseIcon
                                                value={record.student.shoes}
                                            />
                                        </td>
                                        <td>
                                            <TrueFalseIcon
                                                value={record.student.supplies}
                                            />
                                        </td>
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
        if (token) {
            await ReportClient.getStudentSchoolSponsorCsv(token.data);
        }
    }
};
