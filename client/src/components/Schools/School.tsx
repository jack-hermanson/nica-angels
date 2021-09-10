import { FunctionComponent } from "react";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { useStoreState } from "../../store/_store";
import { Card } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
} from "jack-hermanson-component-lib";
import { Clearance } from "../../../../shared/enums";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";

interface Props {
    school: SchoolRecord;
}

export const School: FunctionComponent<Props> = ({ school }: Props) => {
    const currentUser = useStoreState(state => state.currentUser);
    const spanish = useStoreState(state => state.spanish);

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader title={school.name}>
                {currentUser && currentUser.clearance >= Clearance.ADMIN && (
                    <ActionsDropdown
                        size="sm"
                        menuName={spanish ? "Acciones" : "Actions"}
                        options={[
                            new LinkDropdownAction(
                                spanish ? "Editar" : "Edit",
                                `/schools/edit/${school.id}`
                            ),
                        ]}
                    />
                )}
            </ActionCardHeader>
        </Card>
    );
};
