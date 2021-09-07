import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditTown: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            <SettingsTabs />
            {renderHeader()}
            <p>{match.params.id}</p>
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title="Edit Town" />
                </Col>
            </Row>
        );
    }
};
