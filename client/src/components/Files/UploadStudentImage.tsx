import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { UploadForm } from "./UploadForm";
import {
    Clearance,
    FileRequest,
    StudentImageRequest,
} from "../../../../shared";
import { useMinClearance } from "../../utils/useMinClearance";
import { FileClient } from "../../clients/FileClient";

interface Props {
    studentId: number;
}

export const UploadStudentImage: FunctionComponent<Props> = ({
    studentId,
}: Props) => {
    useMinClearance(Clearance.ADMIN);

    const token = useStoreState(state => state.token);

    return (
        <div>
            <UploadForm onSubmit={onSubmit} />
        </div>
    );

    async function onSubmit(fileRequest: FileRequest): Promise<void> {
        if (token) {
            const studentImageRequest: StudentImageRequest = {
                ...fileRequest,
                studentId,
            };
            await FileClient.uploadStudentImage(
                studentImageRequest,
                token.data
            );
        }
    }
};
