import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    SchoolEnrollmentStats,
    SchoolRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { ReportClient } from "../../clients/ReportClient";
import { Col, Row, Table } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { SchoolClient } from "../../clients/SchoolClient";

type GradeNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const StudentsPerGrade: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [enrollmentStats, setEnrollmentStats] = useState<
        SchoolEnrollmentStats[] | undefined
    >(undefined);
    const [schools, setSchools] = useState<SchoolRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            ReportClient.getStudentsPerGradeReport(token.data).then(data => {
                setEnrollmentStats(data);
            });
        }
    }, [token, setEnrollmentStats]);

    useEffect(() => {
        if (token) {
            SchoolClient.getSchools(token.data).then(data => setSchools(data));
        }
    }, [setSchools, token]);

    return (
        <div>
            {renderPageHeader()}
            {renderTable()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={
                            spanish
                                ? "Estudiantes por Nivel"
                                : "Students Per Grade"
                        }
                    />
                </Col>
            </Row>
        );
    }

    function renderTable() {
        return (
            <Row>
                <Col>
                    {enrollmentStats && schools ? (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th />
                                    {schools.map(school => (
                                        <th key={school.id}>{school.name}</th>
                                    ))}
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody(schools, enrollmentStats)}
                            </tbody>
                        </Table>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    function renderTableBody(
        schools: SchoolRecord[],
        enrollmentStats: SchoolEnrollmentStats[]
    ) {
        const gradeNumbers: GradeNumber[] = [0, 1, 2, 3, 4, 5, 6];
        return (
            <Fragment>
                {gradeNumbers.map(gradeNumber => (
                    <Fragment key={gradeNumber}>
                        {renderGrade(gradeNumber, schools, enrollmentStats)}
                    </Fragment>
                ))}
                {renderTotalRow(schools, enrollmentStats)}
            </Fragment>
        );
    }

    function renderGrade(
        grade: GradeNumber,
        schools: SchoolRecord[],
        enrollmentStats: SchoolEnrollmentStats[]
    ) {
        let gradeTotal = 0;
        const gradeTotalsPerSchool: number[] = [];
        for (let school of schools) {
            const schoolGradeNumEnrolled = enrollmentStats.find(
                e => e.schoolId === school.id
            )![`grade${grade}`];
            gradeTotal += schoolGradeNumEnrolled;
            gradeTotalsPerSchool.push(schoolGradeNumEnrolled);
        }
        const numbersToRender = [...gradeTotalsPerSchool, gradeTotal];
        return renderTableRow(`Grade ${grade}`, numbersToRender);
    }

    function renderTableRow(rowLabel: string, numStudents: number[]) {
        return (
            <tr>
                <th>{rowLabel}</th>
                {numStudents.map((count, index) => (
                    <td key={index}>{count}</td>
                ))}
            </tr>
        );
    }

    function renderTotalRow(
        schools: SchoolRecord[],
        enrollmentStats: SchoolEnrollmentStats[]
    ) {
        let totalTotal = 0;
        return (
            <tr style={{ borderTop: "2px solid white" }}>
                <th>Total</th>
                {schools.map(school => {
                    const {
                        grade0,
                        grade1,
                        grade2,
                        grade3,
                        grade4,
                        grade5,
                        grade6,
                    } = enrollmentStats.find(e => e.schoolId === school.id)!;
                    const schoolTotal =
                        grade0 +
                        grade1 +
                        grade2 +
                        grade3 +
                        grade4 +
                        grade5 +
                        grade6;
                    totalTotal += schoolTotal;
                    return <td key={school.id}>{schoolTotal}</td>;
                })}
                <td>{totalTotal}</td>
            </tr>
        );
    }
};
