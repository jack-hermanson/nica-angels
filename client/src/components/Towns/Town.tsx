import { FunctionComponent, useEffect, useState } from "react";
import { TownRecord } from "../../../../shared/resource_models/town";
import { Card, CardBody, CardFooter } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
    LoadingSpinner,
} from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";
import * as timeago from "timeago.js";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { SchoolClient } from "../../clients/SchoolClient";

interface Props {
    town: TownRecord;
}

export const Town: FunctionComponent<Props> = ({ town }: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [schools, setSchools] = useState<SchoolRecord[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (token) {
            SchoolClient.getSchools(token.data).then(data => {
                setSchools(data.filter(s => s.townId === town.id));
            });
        }
    }, [token, setSchools, town]);

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader title={town.name}>
                <ActionsDropdown
                    menuName={spanish ? "Acciones" : "Actions"}
                    size="sm"
                    options={[
                        new LinkDropdownAction(
                            spanish ? "Editar" : "Edit",
                            `/settings/towns/edit/${town.id}`
                        ),
                    ]}
                />
            </ActionCardHeader>
            <CardBody>
                <h6>Schools:</h6>
                {schools ? (
                    <ul className="mb-0">
                        {schools.map(school => (
                            <li key={school.id}>{school.name}</li>
                        ))}
                    </ul>
                ) : (
                    <LoadingSpinner />
                )}
            </CardBody>
            {town.updated !== town.created && (
                <CardFooter className="text-muted">
                    {spanish
                        ? `Corregido ${new Date(
                              town.updated
                          ).toLocaleDateString()}`
                        : `Last updated ${timeago.format(town.updated)}.`}
                </CardFooter>
            )}
        </Card>
    );
};
