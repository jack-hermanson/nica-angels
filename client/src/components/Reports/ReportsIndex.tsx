import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";
import { useMinClearance } from "../../utils/useMinClearance";
import { Clearance } from "@nica-angels/shared";

export const ReportsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    useMinClearance(Clearance.ADMIN);

    return (
        <div>
            <PageHeader title={spanish ? "Reportes" : "Reports"} />
        </div>
    );
};
