import { FunctionComponent, useEffect, useState } from "react";
import {
    KeyValTable,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { Alert, Button, Col, Row } from "reactstrap";
import { Clearance, FileRecord } from "../../../../shared";
import { FileClient } from "../../clients/FileClient";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/_store";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useMinClearance } from "../../utils/useMinClearance";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props extends RouteComponentProps<{ id: string }> {}

export const FileDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const [file, setFile] = useState<FileRecord | undefined>(undefined);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const history = useHistory();

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
                    <PageHeader title="File Details">
                        {renderDeleteButton()}
                    </PageHeader>
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

    function renderDeleteButton() {
        if (file && token) {
            return (
                <Button
                    size="sm"
                    color="danger"
                    onClick={async () => {
                        try {
                            const deleted = await FileClient.delete(
                                file.id,
                                token.data
                            );
                            if (deleted) {
                                addAlert({
                                    text: "File deleted successfully.",
                                    color: "success",
                                });
                                history.push("/settings/files");
                            }
                        } catch (error: any) {
                            addAlert({
                                text: error.message,
                                color: "danger",
                            });
                            scrollToTop();
                        }
                    }}
                >
                    Delete
                </Button>
            );
        }
    }
};
