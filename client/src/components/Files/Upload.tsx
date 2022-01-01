import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance, FileRequest } from "@nica-angels/shared";
import { UploadForm } from "./UploadForm";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { FileClient } from "../../clients/FileClient";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../store/_store";

export const Upload: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const history = useHistory();

    return (
        <div>
            <SettingsTabs />
            <Row>
                <Col>
                    <PageHeader
                        title={spanish ? "Subir Archivo" : "Upload File"}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <UploadForm onSubmit={onSubmit} />
                </Col>
            </Row>
        </div>
    );

    async function onSubmit(fileRequest: FileRequest): Promise<void> {
        if (token) {
            const createdFile = await FileClient.create(
                fileRequest,
                token.data
            );
            history.push(`/settings/files/${createdFile.id}`);
        }
    }
};
