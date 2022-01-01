import { FunctionComponent } from "react";
import { AdminEditAccountRequest } from "@nica-angels/shared";

interface Props {
    onSubmit: (
        adminEditAccountRequest: AdminEditAccountRequest
    ) => Promise<void>;
    callback?: () => any;
}
