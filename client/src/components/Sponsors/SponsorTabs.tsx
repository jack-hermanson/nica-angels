import { FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { NavTabs } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";

export const SettingsTabs: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Row>
            <Col>
                <NavTabs
                    links={[
                        {
                            path: "/sponsors",
                            text: spanish ? "Padrinos" : "Sponsors",
                        },
                        {
                            path: "/sponsorships",
                            text: spanish ? "Patrocinios" : "Sponsorships",
                        },
                    ]}
                />
            </Col>
        </Row>
    );
};
