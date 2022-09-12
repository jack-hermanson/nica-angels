import { Fragment, FunctionComponent } from "react";
import { SponsorshipRecord } from "@nica-angels/shared";
import { Badge } from "reactstrap";
import { useStoreState } from "../../store/_store";
import moment from "moment";
import { DATE_FORMAT } from "../../utils/constants";

interface Props {
    sponsorship: SponsorshipRecord;
    className?: string;
}

export const ExpirationBadge: FunctionComponent<Props> = ({
    sponsorship,
    className,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    if (sponsorship.endDate) {
        return (
            <Badge color="danger" className={className || ""}>
                {spanish ? "Terminado" : "Expired"}{" "}
                {moment(sponsorship.endDate).format(DATE_FORMAT)}
            </Badge>
        );
    }
    return <Fragment />;
};
