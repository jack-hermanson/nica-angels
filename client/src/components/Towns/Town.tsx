import { FunctionComponent } from "react";
import { TownRecord } from "../../../../shared/resource_models/town";
import { Card, CardBody, CardHeader } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
} from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";

interface Props {
    town: TownRecord;
}

export const Town: FunctionComponent<Props> = ({ town }: Props) => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Card>
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
        </Card>
    );
};
