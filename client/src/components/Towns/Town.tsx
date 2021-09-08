import { FunctionComponent } from "react";
import { TownRecord } from "../../../../shared/resource_models/town";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
} from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";
import * as timeago from "timeago.js";

interface Props {
    town: TownRecord;
}

export const Town: FunctionComponent<Props> = ({ town }: Props) => {
    const spanish = useStoreState(state => state.spanish);

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
            </CardBody>
            {town.updated !== town.created && (
                <CardFooter className="text-muted">
                    Last updated {timeago.format(town.updated)}.
                </CardFooter>
            )}
        </Card>
    );
};
