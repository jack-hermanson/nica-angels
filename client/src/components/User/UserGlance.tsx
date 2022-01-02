import { FunctionComponent, useEffect, useState } from "react";
import { Card, CardHeader } from "reactstrap";
import { KeyValCardBody } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { AccountRecord } from "@nica-angels/shared";
import { AccountClient } from "../../clients/AccountClient";
import { Link } from "react-router-dom";
import { ClearanceBadge } from "../Utils/ClearanceBadge";

interface Props {
    account: AccountRecord;
}

export const UserGlance: FunctionComponent<Props> = ({ account }: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [numTokens, setNumTokens] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (token) {
            AccountClient.getTokens(account.id, token.data).then(data => {
                setNumTokens(data);
            });
        }
    }, [setNumTokens, token, account.id]);

    return (
        <Card className="mb-3 no-mb-last">
            <CardHeader>
                <h5 className="mb-0">
                    <Link
                        className="text-white"
                        to={`/settings/users/${account.id}`}
                    >
                        {account.firstName} {account.lastName}
                    </Link>
                </h5>
            </CardHeader>
            <KeyValCardBody
                keyValPairs={[
                    {
                        key: spanish ? "Correo Electrónico" : "Email",
                        val: account.email,
                    },
                    {
                        key: "Tokens",
                        val: numTokens === undefined ? "..." : numTokens,
                    },
                    {
                        key: spanish ? "Autorización" : "Clearance",
                        val: <ClearanceBadge clearance={account.clearance} />,
                    },
                ]}
            />
        </Card>
    );
};
