import { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "../../../../shared/enums";
import { SchoolRecord } from "../../../../shared/resource_models/school";
import { useStoreState } from "../../store/_store";
import { SchoolClient } from "../../clients/SchoolClient";

export interface Props extends RouteComponentProps<{ id: string }> {}

export const EditSchool: FunctionComponent<Props> = ({ match }: Props) => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);

    const [school, setSchool] = useState<SchoolRecord | undefined>(undefined);

    const history = useHistory();

    useEffect(() => {
        if (token) {
            SchoolClient.getOneSchool(parseInt(match.params.id), token.data)
                .then(data => {
                    setSchool(data);
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response.status);
                    }
                });
        }
    }, [token, setSchool, history]);

    return <p>Edit school {match.params.id}</p>;
};
