import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { UploadForm } from "./UploadForm";
import {
    Clearance,
    FileRequest,
    StudentImageRequest,
} from "@nica-angels/shared";
import { useMinClearance } from "../../utils/useMinClearance";
import { FileClient } from "../../clients/FileClient";

interface Props {
    studentId: number;
    setNewFileId: (newId: number) => any;
}

export const UploadStudentImage: FunctionComponent<Props> = ({
    studentId,
    setNewFileId,
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
            const newFile = await FileClient.uploadStudentImage(
                studentImageRequest,
                token.data
            );
            setNewFileId(newFile.id);
        }
    }
};
