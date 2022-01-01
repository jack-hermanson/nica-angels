import { FunctionComponent } from "react";
import { Card } from "reactstrap";
import { ActionCardHeader, KeyValCardBody } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { AccountRecord } from "@nica-angels/shared";

interface Props {
    account: AccountRecord;
}

export const UserGlance: FunctionComponent<Props> = ({ account }: Props) => {
    const spanish = useStoreState(state => state.spanish);

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
                ]}
            />
        </Card>
    );
};
