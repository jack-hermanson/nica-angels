import { FunctionComponent, useEffect, useState } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useStoreState } from "../../store/_store";
import { Button, Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { EnrollmentRecord } from "../../../../shared/resource_models/enrollment";
import { EnrollmentClient } from "../../clients/EnrollmentClient";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";

export const EnrollmentsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const history = useHistory();

    useMinClearance(Clearance.ADMIN);

    const [enrollments, setEnrollments] = useState<
        EnrollmentRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            EnrollmentClient.getEnrollments(token.data).then(data =>
                setEnrollments(data)
            );
        }
    }, [setEnrollments, token]);

    return (
        <div>
            <SettingsTabs />
            {renderHeader()}
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
};
