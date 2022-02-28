import { FunctionComponent } from "react";
import { SponsorshipRecord } from "@nica-angels/shared";

interface Props {
    sponsorship: SponsorshipRecord;
}

export const Sponsorship: FunctionComponent<Props> = ({
    sponsorship,
}: Props) => {
    return (
        <div>
            <p>This is sponsorship with ID {sponsorship.id}</p>
        </div>
    );
};
