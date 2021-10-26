import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared";
import { Button, Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { TownClient } from "../../clients/TownClient";
import { TownRecord } from "../../../../shared";
import { Town } from "./Town";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";

export const TownsIndex: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const history = useHistory();

    const [towns, setTowns] = useState<TownRecord[] | undefined>(undefined);

    useEffect(() => {
        if (token) {
            TownClient.getTowns(token.data).then(towns => {
                setTowns(towns);
            });
        }
    }, [token, setTowns]);

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
                    <PageHeader title={spanish ? "Pueblos" : "Towns"}>
                        <Button
                            size="sm"
                            color={NEW_BUTTON_COLOR}
                            className="icon-button"
                            onClick={() => {
                                history.push("/settings/towns/new");
                            }}
                        >
                            <FaPlus className={BUTTON_ICON_CLASSES} />
                            {spanish ? "Nuevo Pueblo" : "New Town"}
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderList() {
        return (
            <Row>
                <Col xs={12} lg={6}>
                    {towns ? (
                        <Fragment>
                            {towns.map(town => (
                                <Town key={town.id} town={town} />
                            ))}
                        </Fragment>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }
};
