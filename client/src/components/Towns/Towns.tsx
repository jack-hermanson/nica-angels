import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";

export const Towns: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

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
                    <PageHeader title="Towns" />
                </Col>
            </Row>
        );
    }
};
