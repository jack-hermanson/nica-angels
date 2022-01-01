import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";

interface Props extends RouteComponentProps<{ id: string }> {}

export const UserDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const spanish = useStoreState(state => state.spanish);

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
                    <PageHeader
                        title={
                            spanish ? "Detalles del Usuario" : "User Details"
                        }
                    />
                </Col>
            </Row>
        );
    }
};
