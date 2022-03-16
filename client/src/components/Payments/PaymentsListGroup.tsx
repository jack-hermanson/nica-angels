import { Fragment, FunctionComponent } from "react";
import { PaymentRecord } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";
import {
    CardBody,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { LoadingSpinner } from "jack-hermanson-component-lib";

interface Props {
    payments?: PaymentRecord[];
}

export const PaymentsListGroup: FunctionComponent<Props> = ({
    payments,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Fragment>
            {payments ? (
                <Fragment>
                    {payments.length ? (
                        <CardBody className="p-0">
                            <ListGroup flush>
                                {payments.map(payment => (
                                    <ListGroupItem key={payment.id}>
                                        <ListGroupItemHeading className="mb-1">
                                            <Link
                                                to={`/payments/${payment.id}`}
                                            >
                                                ${payment.amount.toFixed(2)}
                                            </Link>
                                        </ListGroupItemHeading>
                                        <ListGroupItemText className="mb-0">
                                            {moment(payment.created).format(
                                                "LLL"
                                            )}
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    ) : (
                        <CardBody>
                            {spanish
                                ? "No hay ningunos pagos."
                                : "There are no payments."}
                        </CardBody>
                    )}
                </Fragment>
            ) : (
                <CardBody>
                    <LoadingSpinner />
                </CardBody>
            )}
        </Fragment>
    );
};
