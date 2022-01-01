import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditUser: FunctionComponent<Props> = ({ match }: Props) => {
    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            <p>For {match.params.id}</p>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title="Edit User" />
                </Col>
            </Row>
        );
    }
};
