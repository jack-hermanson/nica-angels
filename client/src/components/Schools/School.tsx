import { FunctionComponent, useEffect, useState } from "react";
import {
    Clearance,
    SchoolEnrollmentStats,
    SchoolRecord,
    TownRecord,
} from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import { Card, CardBody, CardFooter, Table } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
} from "jack-hermanson-component-lib";
import { LinkDropdownAction } from "jack-hermanson-ts-utils";
import { TownClient } from "../../clients/TownClient";
import { EnrollmentClient } from "../../clients/EnrollmentClient";

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
    const [schoolStats, setSchoolStats] = useState<
        SchoolEnrollmentStats | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            TownClient.getTown(school.townId, token.data).then(data => {
                setTown(data);
            });
            EnrollmentClient.getStatistics(school.id, token.data).then(data => {
                setSchoolStats(data);
            });
        }
    }, [setTown, token, school.townId, setSchoolStats, school.id]);

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
            [1, "st", "er", schoolStats?.grade1],
            [2, "nd", "do", schoolStats?.grade2],
            [3, "rd", "er", schoolStats?.grade3],
            [4, "th", "to", schoolStats?.grade4],
            [5, "th", "to", schoolStats?.grade5],
            [6, "th", "to", schoolStats?.grade6],
        ];

        if (schoolStats) {
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
                                <td>{schoolStats.grade0}</td>
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
                                    <td>{grade[3]}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>{spanish ? "Otros" : "Other"}</td>
                                <td>
                                    {schoolStats.grade7 +
                                        schoolStats.grade8 +
                                        schoolStats.other}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            );
        }
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
                            <div className="ms-auto text-end">
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
