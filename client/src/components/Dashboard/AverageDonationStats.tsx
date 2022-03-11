import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { StatCard } from "./StatCard";

export const AverageDonationStats: FunctionComponent = () => {
    const token = useStoreState(state => state.token);
    const spanish = useStoreState(state => state.spanish);

    const [number, setNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getAverageDonation(token.data).then(data => {
                setNumber(data);
            });
        }
    }, [setNumber, token]);

    return (
        <Fragment>
            {number && (
                <StatCard
                    dollars
                    number={parseFloat(number.toFixed(2))}
                    label={spanish ? "Donación Media" : "Average Donation"}
                />
            )}
        </Fragment>
    );
};
