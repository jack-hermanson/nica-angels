import { Fragment, FunctionComponent, useEffect, useState } from "react";
import {
    ExpandedSponsorshipRecord,
    PaymentMethod,
    PaymentRecord,
} from "@nica-angels/shared";
import { KeyValCardBody, LoadingSpinner } from "jack-hermanson-component-lib";
import { CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { KeyValPair } from "jack-hermanson-ts-utils";

interface Props {
    payment: PaymentRecord;
    sponsorships?: ExpandedSponsorshipRecord[] | undefined;
}

export const PaymentCardBody: FunctionComponent<Props> = ({
    payment,
    sponsorships,
}: Props) => {
    const [sponsorship, setSponsorship] = useState<
        ExpandedSponsorshipRecord | undefined
    >();

    useEffect(() => {
        if (sponsorships) {
            setSponsorship(
                sponsorships.find(s => s.id === payment.sponsorshipId)
            );
        }
    }, [sponsorships, setSponsorship, payment]);

    const keyValPairs: KeyValPair[] = [];

    if (sponsorship) {
        keyValPairs.push(
            ...[
                {
                    key: "Sponsorship",
                    val: (
                        <Link
                            className="px-0"
                            to={`/sponsorships/${sponsorship.id}`}
                        >
                            {sponsorship.studentName} /{" "}
                            {sponsorship.sponsorName}
                        </Link>
                    ),
                },
                {
                    key: "Amount",
                    val: `$${payment.amount.toFixed(2)}`,
                },
                {
                    key: "Payment Method",
                    val: `${PaymentMethod[payment.paymentMethod]}`,
                },
                {
                    key: "Reference Number",
                    val: payment.referenceNumber || "N/A",
                },
                {
                    key: "Created",
                    val: moment(payment.created).format("LLLL"),
                },
            ]
        );

        if (!moment(payment.created).isSame(payment.updated)) {
            keyValPairs.push({
                key: "Updated",
                val: moment(payment.updated).format("LLLL"),
            });
        }

        if (payment.notes) {
            keyValPairs.push({
                key: "Notes",
                val: payment.notes,
            });
        }
    }

    return (
        <Fragment>
            {sponsorship ? (
                <KeyValCardBody keyValPairs={keyValPairs} />
            ) : (
                <CardBody>
                    <LoadingSpinner />
                </CardBody>
            )}
        </Fragment>
    );
};
