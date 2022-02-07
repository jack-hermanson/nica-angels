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
                            path: "/settings",
                            text: spanish ? "Panel" : "Dashboard",
                            exact: true,
                        },
                        {
                            path: "/settings/sponsorships",
                            text: spanish ? "Patrocinios" : "Sponsorships",
                        },
                        {
                            path: "/settings/enrollments",
                            text: spanish ? "Inscritos" : "Enrollments",
                        },
                        {
                            path: "/settings/towns",
                            text: spanish ? "Pueblos" : "Towns",
                        },
                        {
                            path: "/settings/files",
                            text: spanish ? "Archivos" : "Files",
                        },
                        {
                            path: "/settings/users",
                            text: spanish ? "Usuarios" : "Users",
                        },
                    ]}
                />
            </Col>
        </Row>
    );
};
