import { Fragment, FunctionComponent } from "react";
import { FaCheck, FaTimes } from "react-icons/all";

interface Props {
    value: boolean;
    className?: string;
}

export const TrueFalseIcon: FunctionComponent<Props> = ({
    value,
    className,
}: Props) => {
    return (
        <Fragment>
            {value ? (
                <FaCheck className={className || ""} />
            ) : (
                <FaTimes className={className || ""} />
            )}
        </Fragment>
    );
};
