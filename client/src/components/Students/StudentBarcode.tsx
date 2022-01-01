import { Fragment, FunctionComponent, useEffect } from "react";
import { getIdPadded, StudentRecord } from "@nica-angels/shared";
import { ID_PADDING } from "../../utils/constants";
import JsBarcode from "jsbarcode";

interface Props {
    student: StudentRecord;
}

export const StudentBarcode: FunctionComponent<Props> = ({
    student,
}: Props) => {
    useEffect(() => {
        JsBarcode(
            `#student-${student.id}-barcode`,
            getIdPadded(student, ID_PADDING),
            {
                width: 2.5,
                height: 75,
            }
        );
    }, [student]);

    return (
        <Fragment>
            <img
                id={`student-${student.id}-barcode`}
                alt={getIdPadded(student, ID_PADDING)}
            />
        </Fragment>
    );
};
