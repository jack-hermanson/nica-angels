import { FunctionComponent } from "react";
import { ActionCardHeader, KeyValCardBody } from "jack-hermanson-component-lib";
import { AccountRecord, SponsorRecord } from "@nica-angels/shared";
import { Card } from "reactstrap";
import { useStoreState } from "../../store/_store";
import { KeyValPair } from "jack-hermanson-ts-utils";
import { Link } from "react-router-dom";

interface Props {
    sponsor: SponsorRecord;
    account?: AccountRecord;
    showDetailLink?: boolean;
}

export const SponsorDetailCard: FunctionComponent<Props> = ({
    sponsor,
    account,
    showDetailLink = false,
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
            <ActionCardHeader
                title={getSponsorName()}
                linkTo={showDetailLink ? `/sponsors/${sponsor.id}` : undefined}
            />
            <KeyValCardBody keyValPairs={keyValPairs} />
        </Card>
    );

    function getSponsorName(): string {
        let output = "";
        if (spanish) {
            output += "Padrino";
        } else {
            output += "Sponsor";
        }

        output += ` #${sponsor.id} - ${sponsor.firstName} ${sponsor.lastName}`;

        return output;
    }
};
