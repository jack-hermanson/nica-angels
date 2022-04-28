import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { Badge } from "reactstrap";

interface Props {
    value: boolean;
    className?: string;
}

export const YesOrNoBadge: FunctionComponent<Props> = ({
    value,
    className,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Badge color={value ? "success" : "danger"} className={className || ""}>
            {value ? (spanish ? "Sí" : "Yes") : "No"}
        </Badge>
    );
};
