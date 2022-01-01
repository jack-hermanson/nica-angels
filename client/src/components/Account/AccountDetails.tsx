import { FunctionComponent, useEffect, useState } from "react";
import { AccountRecord, Clearance } from "@nica-angels/shared";

interface Props {
    user: AccountRecord;
}

export const AccountDetails: FunctionComponent<Props> = ({ user }: Props) => {
    const [clearance, setClearance] = useState<string>("");

    useEffect(() => {
        switch (user.clearance) {
            case Clearance.NONE:
                setClearance("none");
                break;
            case Clearance.SPONSOR:
                setClearance("sponsor");
                break;
            case Clearance.ADMIN:
                setClearance("admin");
                break;
            case Clearance.SUPER_ADMIN:
                setClearance("super admin");
                break;
        }
    }, [user]);

    return (
        <div>
            <dl>
                <dt>Name</dt>
                <dd>
                    {user.firstName} {user.lastName}
                </dd>

                <dt>Email</dt>
                <dd>{user.email}</dd>

                <dt>Created</dt>
                <dd>{new Date(user.created).toLocaleDateString()}</dd>

                <dt>Clearance</dt>
                <dd>{clearance}</dd>
            </dl>
        </div>
    );
};
