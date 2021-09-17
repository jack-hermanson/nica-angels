import { StudentRecord } from "../../../../shared/resource_models/student";
import { FunctionComponent } from "react";
import {
    EnrollmentRecord,
    EnrollmentRequest,
} from "../../../../shared/resource_models/enrollment";
import { RouteComponentProps } from "react-router-dom";

interface Props {
    onSubmit: (enrollmentRequest: EnrollmentRequest) => Promise<void>;
    existingEnrollment?: EnrollmentRecord;
    studentId?: number;
}

export const CreateEditEnrollmentForm: FunctionComponent<Props> = ({
    onSubmit,
    existingEnrollment,
    studentId,
}: Props) => {
    return (
        <div>
            <p>Enrollment form</p>
            <p>{studentId ? studentId : "no student ID provided"}</p>
        </div>
    );
};
