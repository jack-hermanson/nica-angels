import { FunctionComponent } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";

export const UsersIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Usuarios" : "Users"} />
                </Col>
            </Row>
        );
    }
};
