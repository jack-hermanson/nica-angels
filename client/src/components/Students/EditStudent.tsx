import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, StudentRecord } from "@nica-angels/shared";
import { StudentClient } from "../../clients/StudentClient";
import { HTTP, scrollToTop } from "jack-hermanson-ts-utils";
import { NotFound } from "../Errors/NotFound";
import { CreateEditStudentForm } from "./CreateEditStudentForm";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditStudent: FunctionComponent<Props> = ({ match }: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const addAlert = useStoreActions(actions => actions.addAlert);

    const [student, setStudent] = useState<StudentRecord | undefined>(
        undefined
    );
    const [notFound, setNotFound] = useState(false);

    useMinClearance(Clearance.ADMIN);

    const history = useHistory();

    useEffect(() => {
        if (token) {
            StudentClient.getStudent(parseInt(match.params.id), token.data)
                .then(data => {
                    setStudent(data);
                })
                .catch(error => {
                    if (error.response?.status) {
                        if (error.response.status === HTTP.NOT_FOUND) {
                            setNotFound(true);
                        } else if (error.response.status === HTTP.FORBIDDEN) {
                            history.push("/forbidden");
                        } else {
                            console.log(error.response);
                        }
                    } else {
                        console.error(error);
                    }
                });
        }
    }, [token, match.params.id, history]);

    return (
        <Fragment>
            {notFound ? (
                <NotFound />
            ) : (
                <div>
                    {renderPageHeader()}
                    {renderForm()}
                </div>
            )}
        </Fragment>
    );

    function renderPageHeader() {
        const studentName = student
            ? student.firstName
            : spanish
            ? "Estudiante"
            : "Student";

        return (
            <Row>
                <Col>
                    <PageHeader
                        title={`${spanish ? "Editar" : "Edit"} ${studentName}`}
                    />
                </Col>
            </Row>
        );
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    {student ? (
                        <CreateEditStudentForm
                            onSubmit={async studentRequest => {
                                if (token) {
                                    try {
                                        const editedStudent =
                                            await StudentClient.editStudent({
                                                id: parseInt(match.params.id),
                                                studentRequest,
                                                token: token.data,
                                            });
                                        addAlert({
                                            text: `Successfully edited student: ${editedStudent.firstName}`,
                                            color: "success",
                                        });
                                        history.push("/students");
                                    } catch (error: any) {
                                        console.error(error);
                                        addAlert({
                                            text: error.message,
                                            color: "danger",
                                        });
                                        console.log(error.response);
                                        scrollToTop();
                                    }
                                }
                            }}
                            existingStudent={student}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
