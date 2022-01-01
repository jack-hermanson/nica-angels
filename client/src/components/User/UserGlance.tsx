import { FunctionComponent, useEffect, useState } from "react";
import { Card } from "reactstrap";
import { ActionCardHeader, KeyValCardBody } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { AccountRecord } from "@nica-angels/shared";
import { AccountClient } from "../../clients/AccountClient";

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
    }, [setNumTokens, token]);

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader
                title={`${account.firstName} ${account.lastName}`}
            />
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
                ]}
            />
        </Card>
    );
};
