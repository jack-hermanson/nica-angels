import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { useStoreState } from "../../store/_store";
import { Card, CardBody, CardFooter, Table } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
} from "jack-hermanson-component-lib";
import { Clearance } from "../../../../shared/enums";
import { KeyValPair, LinkDropdownAction } from "jack-hermanson-ts-utils";
import { TownRecord } from "../../../../shared/resource_models/town";
import { TownClient } from "../../clients/TownClient";

interface Props {
    school: SchoolRecord;
    className?: string;
}

export const School: FunctionComponent<Props> = ({
    school,
    className,
}: Props) => {
    const currentUser = useStoreState(state => state.currentUser);
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [town, setTown] = useState<TownRecord | undefined>(undefined);

    useEffect(() => {
        if (token) {
            TownClient.getTown(school.id, token.data).then(data => {
                setTown(data);
            });
        }
    }, [setTown, token]);

    return (
        <div className={className}>
            <Card className={`mb-3 no-mb-last`}>
                {renderCardHeader()}
                {renderStats()}
                {renderFooter()}
            </Card>
        </div>
    );

    function renderCardHeader() {
        if (town) {
            return (
                <ActionCardHeader
                    title={`${school.name} ${
                        town.name !== school.name ? `(${town.name})` : ""
                    }`}
                >
                    {currentUser &&
                        currentUser.clearance >= Clearance.ADMIN && (
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
            );
        }
    }

    function renderStats() {
        // todo - students per grade
        const grades = [
            [1, "st", "er"],
            [2, "nd", "do"],
            [3, "rd", "er"],
            [4, "th", "to"],
            [5, "th", "to"],
            [6, "th", "to"],
        ];

        return (
            <CardBody className="p-0">
                <Table striped className="same-width card-table mb-0">
                    <thead>
                        <tr>
                            <th>{spanish ? "Nivel" : "Level"}</th>
                            <th>{spanish ? "Alumnos" : "Students"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{spanish ? "Preescolar" : "Preschool"}</td>
                            <td>16</td>
                        </tr>
                        {grades.map(grade => (
                            <tr key={grade[0]}>
                                <td>
                                    {grade[0]}
                                    <sup className="ps-0">
                                        {spanish ? grade[2] : grade[1]}
                                    </sup>{" "}
                                    <span className="ps-0">
                                        {spanish ? "grado" : "grade"}
                                    </span>
                                </td>
                                <td>{Math.floor(Math.random() * 12 + 3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardBody>
        );
    }

    function renderFooter() {
        if (currentUser && currentUser.clearance >= Clearance.ADMIN) {
            return (
                <CardFooter>
                    <div className="d-flex text-muted">
                        <div>
                            {spanish ? "Actualizada" : "Created"}{" "}
                            {new Date(school.created).toLocaleDateString()}
                        </div>
                        {school.created !== school.updated && (
                            <div className="ms-auto">
                                {spanish ? "Corregida" : "Last Updated"}{" "}
                                {new Date(school.updated).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </CardFooter>
            );
        }
    }
};
