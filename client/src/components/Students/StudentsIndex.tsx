import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Card, Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { StudentRecord } from "../../../../shared/resource_models/student";
import { Student } from "./Student";

export const StudentsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.SPONSOR);

    const token = useStoreState(state => state.token);

    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            StudentClient.getStudents(token.data).then(data => {
                setStudents(data);
            });
        }
    }, [token, setStudents]);

    return (
        <div>
            {renderPageHeader()}
            <Row>
                <Col xs={12} lg={3}>
                    {renderFiltering()}
                </Col>
                <Col xs={12} lg={9}>
                    {renderStudents()}
                </Col>
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title="Students" />
                </Col>
            </Row>
        );
    }

    function renderFiltering() {
        return (
            <Card>
                <p>Filtering</p>
            </Card>
        );
    }

    function renderStudents() {
        if (students) {
            return (
                <Fragment>
                    {students.map(student => (
                        <Student student={student} />
                    ))}
                </Fragment>
            );
        } else {
            return <LoadingSpinner />;
        }
    }
};
