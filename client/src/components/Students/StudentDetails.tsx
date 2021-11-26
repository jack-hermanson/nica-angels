import { FunctionComponent, Fragment, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StudentRecord } from "../../../../shared";
import { StudentClient } from "../../clients/StudentClient";
import { useStoreState } from "../../store/_store";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";

interface Props extends RouteComponentProps<{ id: string }> {}

export const StudentDetails: FunctionComponent<Props> = ({
    match: {
        params: { id },
    },
}: Props) => {
    const [student, setStudent] = useState<StudentRecord | undefined>(
        undefined
    );

    const token = useStoreState(state => state.token);

    useEffect(() => {
        if (token) {
            StudentClient.getStudent(parseInt(id), token.data).then(s => {
                setStudent(s);
            });
        }
    }, [id, setStudent, token]);

    return (
        <div>
            {student ? (
                <Fragment>
                    <Row>
                        <Col>
                            <PageHeader
                                title={`${student.firstName} ${student.middleName} ${student.lastName}`}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>Student info: {student.firstName}</Col>
                    </Row>
                </Fragment>
            ) : (
                <Fragment>
                    <Row>
                        <Col>
                            <PageHeader title="Student Details" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <LoadingSpinner />
                        </Col>
                    </Row>
                </Fragment>
            )}
        </div>
    );
};
