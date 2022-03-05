import { Fragment, FunctionComponent } from "react";
import { KeyValCardBody } from "jack-hermanson-component-lib";
import { AccountRecord, SponsorRecord } from "@nica-angels/shared";
import { Card, CardHeader } from "reactstrap";
import { useStoreState } from "../../store/_store";
import { KeyValPair } from "jack-hermanson-ts-utils";
import { Link } from "react-router-dom";

interface Props {
    sponsor: SponsorRecord;
    account?: AccountRecord;
    showAccountLink?: boolean;
}

export const SponsorDetailCard: FunctionComponent<Props> = ({
    sponsor,
    account,
    showAccountLink = false,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const keyValPairs: KeyValPair[] = [
        {
            key: spanish ? "Nombre" : "First Name",
            val: sponsor.firstName,
        },
        {
            key: spanish ? "Apellido" : "Last Name",
            val: sponsor.lastName,
        },
        {
            key: spanish ? "Correo Electrónico" : "Email",
            val: sponsor.email,
        },
    ];

    if (account) {
        keyValPairs.push({
            key: spanish ? "Cuenta" : "Account",
            val: (
                <Link className="ps-0" to={`/settings/users/${account.id}`}>
                    {spanish ? "Cuenta" : "Account"} #{account.id}
                </Link>
            ),
        });
    }

    return (
        <Card className="mb-3 no-mb-last">
            <CardHeader>
                <h5 className="mb-0">
                    {showAccountLink ? (
                        <Link
                            className="header-link"
                            to={`/sponsors/${sponsor.id}`}
                        >
                            {getSponsorName()}
                        </Link>
                    ) : (
                        <Fragment>{getSponsorName()}</Fragment>
                    )}
                </h5>
            </CardHeader>
            <KeyValCardBody keyValPairs={keyValPairs} />
        </Card>
    );

    function getSponsorName() {
        return (
            <Fragment>
                {spanish ? "Patrino" : "Sponsor"} #{sponsor.id} -{" "}
                {sponsor.firstName} {sponsor.lastName}
            </Fragment>
        );
    }
};
