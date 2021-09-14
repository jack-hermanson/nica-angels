import { FunctionComponent, useEffect, useState } from "react";
import { AccountRecord } from "../../../../shared/resource_models/account";
import { Clearance } from "../../../../shared/enums";

interface Props {
    user: AccountRecord;
}

export const UserDetails: FunctionComponent<Props> = ({ user }: Props) => {
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
                <dl>
                    {user.firstName} {user.lastName}
                </dl>

                <dt>Email</dt>
                <dl>{user.email}</dl>

                <dt>Created</dt>
                <dl>{new Date(user.created).toLocaleDateString()}</dl>

                <dt>Clearance</dt>
                <dl>{clearance}</dl>
            </dl>
        </div>
    );
};
