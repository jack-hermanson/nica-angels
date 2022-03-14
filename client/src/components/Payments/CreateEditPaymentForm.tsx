import { FunctionComponent, useState } from "react";
import { useStoreState } from "../../store/_store";
import { Form } from "formik";

interface Props {
    onSubmit: (paymentRequest: PaymentRequest) => Promise<void>;
}

export const CreateEditPaymentForm: FunctionComponent<Props> = ({
    onSubmit,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const [sponsorships, setSponsorships] = useState(undefined);

    return (
        <Form>
            <p>Todo</p>
        </Form>
    );
};
