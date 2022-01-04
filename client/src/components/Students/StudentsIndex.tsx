import {
    Fragment,
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Button,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import {
    ActionsDropdown,
    LoadingSpinner,
    MobileToggleCard,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import {
    Clearance,
    GetStudentsRequest,
    SchoolRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { StudentClient } from "../../clients/StudentClient";
import { Student } from "./Student";
import {
    ClickDropdownAction,
    LinkDropdownAction,
} from "jack-hermanson-ts-utils";
import { RESET_BUTTON_COLOR, SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { Field, Form, Formik } from "formik";
import { SchoolClient } from "../../clients/SchoolClient";

export const StudentsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.SPONSOR);

    const token = useStoreState(state => state.token);
    const currentUser = useStoreState(state => state.currentUser);
    const spanish = useStoreState(state => state.spanish);

    const [students, setStudents] = useState<StudentRecord[] | undefined>(
        undefined
    );
    const [schools, setSchools] = useState<SchoolRecord[] | undefined>(
        undefined
    );

    const [searchText, setSearchText] = useState("");
    const [minLevel, setMinLevel] = useState("0");
    const [maxLevel, setMaxLevel] = useState("12");

    // pagination
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);

    // get students
    const getStudents = useCallback(
        (getStudentsRequest: GetStudentsRequest) => {
            console.log("getStudents useCallback");
            if (token) {
                StudentClient.getStudents(getStudentsRequest, token.data).then(
                    data => {
                        setStudents(s => {
                            if (!s) {
                                return data.items;
                            } else {
                                return [...s, ...data.items];
                            }
                        });
                        setTotal(data.total);
                        setCount(c => c + data.count);
                        console.log("data.count", data.count);
                    }
                );
            }
        },
        [setTotal, setCount, setStudents, token]
    );

    useEffect(() => {
        getStudents({
            searchText: "",
            skip: 0,
            take: 10,
            minLevel: 0,
            maxLevel: 12,
        });
        if (token) {
            SchoolClient.getSchools(token.data).then(data => {
                setSchools(data);
            });
        }
    }, [getStudents, token, setSchools]);

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
        const searchTextId = "search-text-input";
        const minLevelId = "min-level-input";
        const maxLevelId = "max-level-input";
        return (
            <MobileToggleCard
                cardTitle={"Filtering"}
                className="sticky-top mb-3 mb-lg-0"
            >
                <CardBody>
                    <Formik
                        initialValues={{
                            searchText: "",
                            minLevel: "0",
                            maxLevel: "12",
                        }}
                        onSubmit={data => {
                            console.log({ take });
                            resetData();
                            setSearchText(data.searchText);
                            setMinLevel(data.minLevel);
                            setMaxLevel(data.maxLevel);
                            getStudents({
                                searchText: data.searchText,
                                skip: 0,
                                take: 10,
                                minLevel: parseInt(data.minLevel),
                                maxLevel: parseInt(data.maxLevel),
                            });
                        }}
                        onReset={() => {
                            resetData();
                            setSearchText("");
                            setMinLevel("0");
                            setMaxLevel("12");
                            getStudents({
                                searchText: "",
                                skip,
                                take,
                                minLevel: 0,
                                maxLevel: 12,
                            });
                        }}
                    >
                        <Form>
                            <FormGroup>
                                <Label
                                    className="form-label"
                                    for={searchTextId}
                                >
                                    {spanish ? "Buscar" : "Search"}
                                </Label>
                                <Field
                                    as={Input}
                                    placeholder={
                                        spanish ? "Buscar..." : "Search..."
                                    }
                                    name="searchText"
                                    type="text"
                                    id={searchTextId}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="form-label" for={minLevelId}>
                                    {spanish ? "Nivel Mínimo" : "Minimum Level"}
                                </Label>
                                <Field
                                    as={Input}
                                    name="minLevel"
                                    id={minLevelId}
                                    type="number"
                                    min={0}
                                    max={12}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="form-label" for={maxLevelId}>
                                    {spanish ? "Nivel Máximo" : "Maximum Level"}
                                </Label>
                                <Field
                                    as={Input}
                                    name="maxLevel"
                                    id={maxLevelId}
                                    type="number"
                                    min={0}
                                    max={12}
                                />
                            </FormGroup>
                            <div className="d-grid col-12 mt-4">
                                <Button
                                    type="submit"
                                    className="mb-2"
                                    color={SUBMIT_BUTTON_COLOR}
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="reset"
                                    size="sm"
                                    color={RESET_BUTTON_COLOR}
                                >
                                    Reset
                                </Button>
                            </div>
                        </Form>
                    </Formik>
                </CardBody>
            </MobileToggleCard>
        );
    }

    function renderStudents() {
        if (students && schools) {
            return (
                <Fragment>
                    {students.map(student => (
                        <Student
                            key={student.id}
                            student={student}
                            school={schools.find(
                                s => s.id === student.schoolId
                            )}
                        />
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
                            onClick={() => {}}
                            onMouseDown={e => {
                                setSkip(s => s + 10);
                                getStudents({
                                    skip: skip + 10,
                                    take,
                                    searchText,
                                    minLevel: parseInt(minLevel),
                                    maxLevel: parseInt(maxLevel),
                                });
                                e.preventDefault();
                            }}
                        >
                            {spanish ? "Cargar Más" : "Load More"}
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => {
                                setSkip(s => s + 10);
                                setTake(total);
                                getStudents({
                                    skip: skip + 10,
                                    take: total,
                                    searchText,
                                    minLevel: parseInt(minLevel),
                                    maxLevel: parseInt(maxLevel),
                                });
                            }}
                        >
                            {spanish ? "Cargar Todos" : "Load All"}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    function resetData() {
        setStudents(undefined);
        setMinLevel("0");
        setMaxLevel("12");
        setSkip(0);
        setCount(0);
        setTotal(0);
    }
};
