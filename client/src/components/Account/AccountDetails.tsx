import { FunctionComponent } from "react";
import { AccountRecord } from "@nica-angels/shared";
import { ClearanceBadge } from "../Utils/ClearanceBadge";

interface Props {
    user: AccountRecord;
}

export const AccountDetails: FunctionComponent<Props> = ({ user }: Props) => {
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
                <dd>
                    <ClearanceBadge clearance={user.clearance} />
                </dd>
            </dl>
        </div>
    );
};
