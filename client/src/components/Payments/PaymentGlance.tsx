import { FunctionComponent } from "react";
import { ExpandedSponsorshipRecord, PaymentRecord } from "@nica-angels/shared";
import { Card } from "reactstrap";
import { ActionCardHeader } from "jack-hermanson-component-lib";
import { PaymentCardBody } from "./PaymentCardBody";

interface Props {
    payment: PaymentRecord;
    sponsorships?: ExpandedSponsorshipRecord[];
}

export const PaymentGlance: FunctionComponent<Props> = ({
    payment,
    sponsorships,
}) => {
    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader
                title={`Payment #${payment.id}`}
                linkTo={`/payments/${payment.id}`}
            />
            <PaymentCardBody payment={payment} sponsorships={sponsorships} />
        </Card>
    );
};
