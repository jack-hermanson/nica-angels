import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { StatCard } from "./StatCard";
import { StudentClient } from "../../clients/StudentClient";

export const StudentStats: FunctionComponent = () => {
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [number, setNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (token) {
            StudentClient.getCount(token.data).then(data => {
                setNumber(data);
            });
        }
    }, [setNumber, token]);

    return (
        <Fragment>
            {token && number && (
                <StatCard
                    number={number}
                    label={spanish ? "Estudiantes" : "Students"}
                />
            )}
        </Fragment>
    );
};
