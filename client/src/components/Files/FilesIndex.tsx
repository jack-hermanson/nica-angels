import { FunctionComponent } from "react";
import { Button, Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useStoreState } from "../../store/_store";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaUpload } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared";

export const FilesIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const spanish = useStoreState(state => state.spanish);

    const history = useHistory();

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
                <Col>adfs</Col>
            </Row>
        );
    }
};
