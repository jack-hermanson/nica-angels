import { FunctionComponent } from "react";
import { StudentRecord } from "../../../../shared/resource_models/student";

interface Props {
    student: StudentRecord;
}

export const Student: FunctionComponent<Props> = ({ student }: Props) => {
    return (
        <div>
            <p>
                {student.firstName} {student.lastName || ""}
            </p>
        </div>
    );
};
