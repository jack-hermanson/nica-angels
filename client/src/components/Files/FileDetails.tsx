import { FunctionComponent, useEffect, useState } from "react";
import {
    KeyValTable,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { Alert, Col, Row } from "reactstrap";
import { Clearance, FileRecord } from "../../../../shared";
import { FileClient } from "../../clients/FileClient";
import { RouteComponentProps } from "react-router-dom";
import { useStoreState } from "../../store/_store";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useMinClearance } from "../../utils/useMinClearance";

interface Props extends RouteComponentProps<{ id: string }> {}

export const FileDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const [file, setFile] = useState<FileRecord | undefined>(undefined);
    const token = useStoreState(state => state.token);

    useMinClearance(Clearance.ADMIN);

    useEffect(() => {
        if (token) {
            FileClient.getOne(parseInt(match.params.id), token.data).then(f =>
                setFile(f)
            );
        }
    }, [setFile, token, match.params.id]);

    return (
        <div>
            <SettingsTabs />
            <Row>
                <Col>
                    <PageHeader title="File Details" />
                </Col>
            </Row>
            {!file ? (
                <Row>
                    <Col>
                        <LoadingSpinner />
                    </Col>
                </Row>
            ) : (
                <div>
                    <Row>
                        <Col xs={6} className="mb-3">
                            {file.mimeType.startsWith("image/") ? (
                                <img
                                    className="img-thumbnail"
                                    alt={file.name}
                                    src={file.data}
                                />
                            ) : (
                                <Alert color="danger">
                                    This file's mimeType is {file.mimeType},
                                    which is not supported.
                                </Alert>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={6}>
                            <KeyValTable
                                striped
                                keyValPairs={[
                                    { key: "Name", val: file.name },
                                    { key: "Type", val: file.mimeType },
                                    {
                                        key: "Uploaded",
                                        val: new Date(
                                            file.created
                                        ).toLocaleString(),
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};
