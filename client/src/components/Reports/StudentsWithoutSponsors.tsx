import { FunctionComponent, useEffect, useState } from "react";
import { Col, Row, Table } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, getAge, StudentRecord } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { Link } from "react-router-dom";
import { ReportClient } from "../../clients/ReportClient";
import { ReportActions } from "./ReportActions";

export const StudentsWithoutSponsors: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            StudentClient.getWithoutSponsors(token.data).then(data => {
                setStudents(data);
            });
        }
    }, [token, setStudents]);

    return (
        <div>
            {renderPageHeader()}
            {renderTable()}
        </div>
    );

    function renderPageHeader() {
        const title = spanish
            ? "Estudiantes sin Padrino"
            : "Students without a Sponsor";
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
                    {students ? (
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Level</th>
                                    <th>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <Link
                                                to={`/students/${student.id}`}
                                            >
                                                {student.id}
                                            </Link>
                                        </td>
                                        <td>{student.firstName}</td>
                                        <td>{student.middleName || ""}</td>
                                        <td>{student.lastName || ""}</td>
                                        <td>{student.level}</td>
                                        <td>{getAge(student) || ""}</td>
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
            if (token) {
                await ReportClient.getStudentsWithoutSponsors(token.data);
            }
        }
    }
};
