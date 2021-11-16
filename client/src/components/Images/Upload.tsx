import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared";
import { UploadForm } from "./UploadForm";

export const Upload: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Upload File" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <UploadForm />
                </Col>
            </Row>
        </div>
    );
};
