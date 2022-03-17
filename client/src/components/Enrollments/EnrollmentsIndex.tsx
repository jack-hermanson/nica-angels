import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { Badge, Button, Col, Row, Table } from "reactstrap";
import {
    ActionsDropdown,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    EnrollmentRecord,
    SchoolRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { EnrollmentClient } from "../../clients/EnrollmentClient";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { SchoolClient } from "../../clients/SchoolClient";
import { StudentClient } from "../../clients/StudentClient";
import moment from "moment";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";
import { StudentTabs } from "../Students/StudentTabs";

export const EnrollmentsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const history = useHistory();

    useMinClearance(Clearance.ADMIN);

    const [enrollments, setEnrollments] = useState<
        EnrollmentRecord[] | undefined
    >(undefined);
    const [schools, setSchools] = useState<SchoolRecord[] | undefined>(
        undefined
    );
    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            EnrollmentClient.getEnrollments(token.data).then(data =>
                setEnrollments(data)
            );
        }
    }, [token, setEnrollments]);

    useEffect(() => {
        if (token) {
            SchoolClient.getSchools(token.data).then(data => {
                setSchools(data);
            });
        }
    }, [token, setSchools]);

    useEffect(() => {
        if (token) {
            StudentClient.getStudents(
                { skip: 0, take: 0, searchText: "", minLevel: 0, maxLevel: 12 },
                token.data
            ).then(data => {
                setStudents(data.items);
            });
        }
    }, [setStudents, token]);

    return (
        <div>
            <StudentTabs />
            {renderHeader()}
            {renderTable()}
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Inscritos" : "Enrollments"}>
                        <Button
                            size="sm"
                            color={NEW_BUTTON_COLOR}
                            className="icon-button"
                            onClick={() => {
                                history.push("/enrollments/new");
                            }}
                        >
                            <FaPlus className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Nuevo Inscrito" : "New Enrollment"}
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderTable() {
        return (
            <Row>
                <Col>
                    {students && enrollments && schools ? (
                        <div className="table-responsive-lg">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>
                                            {spanish ? "Estudiante" : "Student"}
                                        </th>
                                        <th>
                                            {spanish ? "Escuela" : "School"}
                                        </th>
                                        <th>
                                            {spanish
                                                ? "Fecha de Comienzo"
                                                : "Start Date"}
                                        </th>
                                        <th>
                                            {spanish
                                                ? "Fecha de Cierre"
                                                : "End Date"}
                                        </th>
                                        <th>
                                            {spanish ? "Acciones" : "Actions"}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.map(enrollment => (
                                        <tr key={enrollment.id}>
                                            {renderEnrollmentRow(enrollment)}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div>
                            <LoadingSpinner />
                            <p>
                                schools null?{" "}
                                {(schools === undefined).toString()}
                            </p>
                            <p>
                                enrollments null?{" "}
                                {(enrollments === undefined).toString()}
                            </p>
                            <p>
                                students null?{" "}
                                {(students === undefined).toString()}
                            </p>
                        </div>
                    )}
                </Col>
            </Row>
        );
    }

    function renderEnrollmentRow(enrollment: EnrollmentRecord) {
        if (schools && students) {
            const school = schools.find(s => s.id === enrollment.schoolId);
            const student = students.find(s => s.id === enrollment.studentId);

            if (!school || !student) {
                return (
                    <Fragment>
                        <p>School null? {school === undefined}</p>
                        <p>Student null? {student === undefined}</p>
                    </Fragment>
                );
            }

            return (
                <Fragment>
                    <td>
                        <Link to={`/students/${student.id}`}>
                            {student.firstName} {student.middleName || ""}{" "}
                            {student.lastName || ""}
                        </Link>
                        {enrollment.endDate &&
                            new Date(enrollment.endDate) < new Date() && (
                                <Badge className="ms-2" color="danger">
                                    {spanish ? "Expirado" : "Expired"}
                                </Badge>
                            )}
                    </td>
                    <td>{school.name}</td>
                    <td>
                        {enrollment.startDate
                            ? moment(enrollment.startDate)
                                  .toDate()
                                  .toLocaleDateString()
                            : ""}
                    </td>
                    <td>
                        {enrollment.endDate
                            ? moment(enrollment.endDate)
                                  .toDate()
                                  .toLocaleDateString()
                            : ""}
                    </td>
                    <td>
                        <ActionsDropdown
                            end={false}
                            options={[
                                new LinkDropdownAction(
                                    "Edit",
                                    `/enrollments/edit/${enrollment.id}`
                                ),
                            ]}
                            size="sm"
                            menuName={spanish ? "Acciones" : "Actions"}
                        />
                    </td>
                </Fragment>
            );
        }
    }
};
