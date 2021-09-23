import { FunctionComponent, useEffect, useState } from "react";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Button, Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../store/_store";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { SchoolClient } from "../../clients/SchoolClient";
import { School } from "./School";

export const SchoolsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.SPONSOR);

    const spanish = useStoreState(state => state.spanish);
    const currentUser = useStoreState(state => state.currentUser);
    const token = useStoreState(state => state.token);
    const history = useHistory();

    const [schools, setSchools] = useState<SchoolRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            SchoolClient.getSchools(token.data).then(data => {
                setSchools(data);
            });
        }
    }, [setSchools, token]);

    return (
        <div>
            {renderHeader()}
            {renderSchools()}
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Escuelas" : "Schools"}>
                        {currentUser &&
                            currentUser.clearance >= Clearance.ADMIN && (
                                <Button
                                    size="sm"
                                    color={NEW_BUTTON_COLOR}
                                    className="icon-button"
                                    onClick={() => {
                                        history.push("/schools/new");
                                    }}
                                >
                                    <FaPlus className={BUTTON_ICON_CLASSES} />
                                    {spanish ? "Nueva Escuela" : "New School"}
                                </Button>
                            )}
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderSchools() {
        return (
            <Row>
                <Col>
                    {schools ? (
                        <Row>
                            {schools.map(school => (
                                <School
                                    className="col-12 col-lg-4"
                                    school={school}
                                    key={school.id}
                                />
                            ))}
                        </Row>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
