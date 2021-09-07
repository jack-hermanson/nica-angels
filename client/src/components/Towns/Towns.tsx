import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { TownClient } from "../../clients/TownClient";
import { TownRecord } from "../../../../shared/resource_models/town";

export const Towns: FunctionComponent = () => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

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
                    <PageHeader title={spanish ? "Pueblos" : "Towns"} />
                </Col>
            </Row>
        );
    }

    function renderList() {
        return (
            <Row>
                <Col>
                    {towns ? (
                        <Fragment>
                            {towns.map(town => (
                                <p key={town.id}>{town.name}</p>
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
