import { FunctionComponent, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageHeader } from "jack-hermanson-component-lib";
import { SponsorRecord } from "@nica-angels/shared";
import { Col, Row } from "reactstrap";

interface Props extends RouteComponentProps<{ id: string }> {}

export const SponsorDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );

    return (
        <div>
            {renderPageHeader()}
            <Row>
                <Col>
                    <p>This is for sponsor {match.params.id}</p>
                </Col>
            </Row>
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={
                            sponsor
                                ? `${sponsor.firstName} ${sponsor.lastName}`
                                : "Sponsor Details"
                        }
                    />
                </Col>
            </Row>
        );
    }
};
