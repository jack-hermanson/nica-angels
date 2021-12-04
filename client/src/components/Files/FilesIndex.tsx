import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useStoreState } from "../../store/_store";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaUpload } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared";
import { FileClient } from "../../clients/FileClient";
import { FilePreview } from "./FilePreview";

export const FilesIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);
    const [fileIds, setFileIds] = useState<number[] | undefined>(undefined);

    const history = useHistory();

    useEffect(() => {
        FileClient.getIds().then(ids => setFileIds(ids));
    }, [fileIds]);

    return (
        <div>
            <SettingsTabs />
            {renderHeader()}
            {renderList()}
        </div>
    );

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Archivos" : "Files"}>
                        <Button
                            size="sm"
                            color={NEW_BUTTON_COLOR}
                            className="icon-button"
                            onClick={() => {
                                history.push("/settings/files/upload");
                            }}
                        >
                            <FaUpload className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Subir Archivo" : "Upload File"}
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderList() {
        return (
            <Row>
                <Col>
                    {!fileIds ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {fileIds.map(fileId => (
                                <FilePreview id={fileId} key={fileId}>
                                    {fileId}
                                </FilePreview>
                            ))}
                        </Fragment>
                    )}
                </Col>
            </Row>
        );
    }
};
