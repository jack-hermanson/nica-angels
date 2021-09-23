import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useStoreState } from "../../store/_store";
import { Button, Col, Row, Table } from "reactstrap";
import {
    ActionsDropdown,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { EnrollmentRecord } from "../../../../shared/resource_models/enrollment";
import { EnrollmentClient } from "../../clients/EnrollmentClient";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { StudentRecord } from "../../../../shared/resource_models/student";
import { SchoolClient } from "../../clients/SchoolClient";
import { StudentClient } from "../../clients/StudentClient";
import moment from "moment";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";

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
            SchoolClient.getSchools(token.data).then(data => {
                setSchools(data);
            });
            StudentClient.getStudents(
                { skip: 0, take: 0, searchText: "" },
                token.data
            ).then(data => {
                setStudents(data.items);
            });
        }
    }, [setEnrollments, token, setSchools, setStudents]);

    return (
        <div>
            <SettingsTabs />
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
                                history.push("/settings/enrollments/new");
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
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        {spanish ? "Estudiante" : "Student"}
                                    </th>
                                    <th>{spanish ? "Escuela" : "School"}</th>
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
                                    <th>{spanish ? "Acciones" : "Actions"}</th>
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
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    function renderEnrollmentRow(enrollment: EnrollmentRecord) {
        if (schools && students) {
            const school = schools.find(s => s.id === enrollment.schoolId)!;
            const student = students.find(s => s.id === enrollment.studentId)!;

            return (
                <Fragment>
                    <td>
                        {student.firstName} {student.middleName || ""}{" "}
                        {student.lastName || ""}
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
                                    `/settings/enrollments/edit/${enrollment.id}`
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
