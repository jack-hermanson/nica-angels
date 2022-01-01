import { FunctionComponent, useEffect, useState } from "react";
import {
    ConfirmationModal,
    KeyValTable,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { Alert, Button, Col, Row } from "reactstrap";
import { Clearance, FileRecord } from "@nica-angels/shared";
import { FileClient } from "../../clients/FileClient";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/_store";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useMinClearance } from "../../utils/useMinClearance";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props extends RouteComponentProps<{ id: string }> {}

export const FileDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const [file, setFile] = useState<FileRecord | undefined>(undefined);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const token = useStoreState(state => state.token);
    const addAlert = useStoreActions(actions => actions.addAlert);
    const spanish = useStoreState(state => state.spanish);

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
                    <PageHeader
                        title={
                            spanish ? "Detalles del Archivo" : "File Details"
                        }
                    >
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
                    {renderImage()}
                    {renderKeyVals()}
                    {renderDeleteModal()}
                </div>
            )}
        </div>
    );

    function renderImage() {
        if (file) {
            return (
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
                                This file's mimeType is {file.mimeType}, which
                                is not supported.
                            </Alert>
                        )}
                    </Col>
                </Row>
            );
        }
    }

    function renderKeyVals() {
        if (file) {
            return (
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
            );
        }
    }

    function renderDeleteModal() {
        if (file && token) {
            return (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    setIsOpen={setShowDeleteModal}
                    title={"Confirm File Deletion"}
                    onConfirm={async () => {
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
                    buttonText={"Delete"}
                    buttonColor={"danger"}
                >
                    Are you sure you want to delete this file?
                </ConfirmationModal>
            );
        }
    }

    function renderDeleteButton() {
        if (file) {
            return (
                <Button
                    size="sm"
                    color="danger"
                    onClick={async () => {
                        setShowDeleteModal(true);
                    }}
                >
                    {spanish ? "Eliminar" : "Delete"}
                </Button>
            );
        }
    }
};
