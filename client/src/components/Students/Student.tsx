import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { StudentRecord } from "../../../../shared/resource_models/student";

interface Props {
    student: StudentRecord;
}

export const Student: FunctionComponent<Props> = ({ student }: Props) => {
    return (
        <div>
            <p>
                {student.firstName} {student.lastName || ""}
                <Link to={`/students/edit/${student.id}`}>Edit</Link>
            </p>
        </div>
    );
};
