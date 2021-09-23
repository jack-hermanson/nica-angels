import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import {
    ActionsDropdown,
    LoadingSpinner,
    MobileToggleCard,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { StudentRecord } from "../../../../shared/resource_models/student";
import { Student } from "./Student";
import {
    ClickDropdownAction,
    LinkDropdownAction,
} from "jack-hermanson-ts-utils";

export const StudentsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.SPONSOR);

    const token = useStoreState(state => state.token);
    const currentUser = useStoreState(state => state.currentUser);
    const spanish = useStoreState(state => state.spanish);

    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );

    // pagination
    const [take, setTake] = useState(10);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (token) {
            StudentClient.getStudents({ skip: 0, take }, token.data).then(
                data => {
                    setStudents(data.items);
                    setTotal(data.total);
                    setCount(data.count);
                }
            );
        }
    }, [token, setStudents, take, setTotal, setCount]);

    return (
        <div>
            {renderPageHeader()}
            <Row>
                <Col xs={12} lg={3}>
                    {renderFiltering()}
                </Col>
                <Col xs={12} lg={9}>
                    {renderStudents()}
                    {renderLoadMore()}
                </Col>
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Estudiantes" : "Students"}>
                        {currentUser &&
                            currentUser.clearance >= Clearance.ADMIN && (
                                <ActionsDropdown
                                    menuName={spanish ? "Acciones" : "Actions"}
                                    size="sm"
                                    options={[
                                        new LinkDropdownAction(
                                            spanish
                                                ? "Nuevo Estudiante"
                                                : "New Student",
                                            "/students/new"
                                        ),
                                        new ClickDropdownAction(
                                            spanish ? "Graduarse" : "Graduate",
                                            () => {
                                                console.log(
                                                    "move students up one grade"
                                                );
                                            }
                                        ),
                                    ]}
                                />
                            )}
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderFiltering() {
        return (
            <MobileToggleCard
                cardTitle={"Filtering"}
                className="sticky-top mb-3 mb-lg-0"
            >
                <CardBody>
                    <p>Test</p>
                </CardBody>
            </MobileToggleCard>
        );
    }

    function renderStudents() {
        if (students) {
            return (
                <Fragment>
                    {students.map(student => (
                        <Student key={student.id} student={student} />
                    ))}
                </Fragment>
            );
        } else {
            return <LoadingSpinner />;
        }
    }

    function renderLoadMore() {
        return (
            <div className="mt-3">
                <p className="text-muted">
                    {spanish ? "Mostrando" : "Displaying"} {count}{" "}
                    {spanish ? "de" : "of"} {total}{" "}
                    {spanish ? "estudiantes" : "students"}.
                </p>
                {token && count < total && students && (
                    <div className="bottom-buttons mt-0">
                        <Button
                            color="secondary"
                            onClick={async () => {
                                StudentClient.getStudents(
                                    { skip: count, take },
                                    token.data
                                ).then(data => {
                                    setStudents([...students, ...data.items]);
                                    setTotal(data.total);
                                    setCount(count + data.count);
                                });
                            }}
                            onMouseDown={e => {
                                e.preventDefault();
                            }}
                        >
                            {spanish ? "Cargar" : "Load"} {take}{" "}
                            {spanish ? "Más" : "More"}
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => setTake(total)}
                        >
                            {spanish ? "Cargar Todos" : "Load All"}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
};
