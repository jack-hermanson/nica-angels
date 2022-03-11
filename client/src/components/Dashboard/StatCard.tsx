import { FunctionComponent } from "react";

interface Props {
    number: number;
    label: string;
    dollars?: boolean;
}

export const StatCard: FunctionComponent<Props> = ({
    number,
    label,
    dollars = false,
}: Props) => {
    return (
        <div className="stat-card">
            <div className="number">
                {dollars ? "$" : ""}
                {number}
            </div>
            <div className="label">{label}</div>
        </div>
    );
};
