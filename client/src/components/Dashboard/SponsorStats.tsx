import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import { useStoreState } from "../../store/_store";
import { SponsorClient } from "../../clients/SponsorClient";

export const SponsorStats: FunctionComponent = () => {
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [number, setNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (token) {
            SponsorClient.getCount(token.data).then(data => {
                setNumber(data);
            });
        }
    }, [token, setNumber]);

    return (
        <Fragment>
            {number && (
                <StatCard
                    number={number}
                    label={spanish ? "Padrinos" : "Sponsors"}
                />
            )}
        </Fragment>
    );
};
