import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { useStoreState } from "../../store/_store";
import { SchoolClient } from "../../clients/SchoolClient";
import { HTTP } from "jack-hermanson-ts-utils";
import { NotFound } from "../Errors/NotFound";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { CreateEditSchoolForm } from "./CreateEditSchoolForm";

export interface Props extends RouteComponentProps<{ id: string }> {}

export const EditSchool: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [school, setSchool] = useState<SchoolRecord | undefined>(undefined);
    const [notFound, setNotFound] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (token) {
            SchoolClient.getOneSchool(parseInt(match.params.id), token.data)
                .then(data => {
                    setSchool(data);
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
    }, [token, setSchool, history, match.params.id, setNotFound]);

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
        if (school) {
            return (
                <Row>
                    <Col>
                        <PageHeader
                            title={`${spanish ? "Editar" : "Edit"} ${
                                school.name
                            }`}
                        />
                    </Col>
                </Row>
            );
        }
    }

    function renderForm() {
        return (
            <Row>
                <Col>
                    {school && token ? (
                        <CreateEditSchoolForm
                            onSubmit={async schoolRequest => {
                                console.log(schoolRequest);
                            }}
                            existingSchool={school}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
