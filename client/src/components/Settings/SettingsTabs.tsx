import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { NavTabs } from "jack-hermanson-component-lib";

export const SettingsTabs: FunctionComponent = () => {
    return (
        <Row>
            <Col>
                <NavTabs
                    links={[
                        { path: "/settings", text: "Dashboard", exact: true },
                        { path: "/settings/towns", text: "Towns" },
                    ]}
                />
            </Col>
        </Row>
    );
};
