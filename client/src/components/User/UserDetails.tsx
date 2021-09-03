import { FunctionComponent } from "react";
import { AccountRecord } from "../../../../shared/resource_models/account";

interface Props {
    user: AccountRecord;
}

export const UserDetails: FunctionComponent<Props> = ({ user }: Props) => {
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
            </dl>
        </div>
    );
};
