import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";
import { Link } from "react-router-dom";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { Col, Row } from "reactstrap";

export const SponsorsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const currentUser = useStoreState(state => state.currentUser);

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            {renderPageHeader()}
            {renderList()}
        </div>
    );

    function renderPageHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title={spanish ? "Padrinos" : "Sponsors"}>
                        {currentUser &&
                            currentUser.clearance >= Clearance.ADMIN && (
                                <Link
                                    to="/sponsors/new"
                                    className={`btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                                >
                                    <FaPlus className={BUTTON_ICON_CLASSES} />
                                    {spanish ? "Nuevo Padrino" : "New Sponsor"}
                                </Link>
                            )}
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderList() {
        return (
            <Row>
                <Col>
                    <p>This is the list of sponsors</p>
                </Col>
            </Row>
        );
    }
};
