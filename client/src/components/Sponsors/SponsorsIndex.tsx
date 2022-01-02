import { FunctionComponent } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";

export const SponsorsIndex: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <div>
            <PageHeader title={spanish ? "Padrinos" : "Sponsors"} />
        </div>
    );
};
