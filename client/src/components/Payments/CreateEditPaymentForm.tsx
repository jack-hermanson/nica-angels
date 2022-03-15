import { FunctionComponent, useEffect, useState } from "react";
import { useStoreState } from "../../store/_store";
import { Form } from "formik";
import { ExpandedSponsorshipRecord } from "@nica-angels/shared";
import { SponsorshipClient } from "../../clients/SponsorshipClient";

interface Props {
    onSubmit: (paymentRequest: PaymentRequest) => Promise<void>;
}

export const CreateEditPaymentForm: FunctionComponent<Props> = ({
    onSubmit,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [sponsorships, setSponsorships] = useState<
        ExpandedSponsorshipRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getExpandedSponsorships(token.data).then(data => {
                setSponsorships(data);
            });
        }
    }, [setSponsorships, token]);

    return (
        <Form>
            <p>Todo</p>
        </Form>
    );
};
