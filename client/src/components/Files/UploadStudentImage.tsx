import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { UploadForm } from "./UploadForm";
import { FileRequest } from "../../../../shared";

interface Props {
    studentId: number;
}

export const UploadStudentImage: FunctionComponent<Props> = ({
    studentId,
}: Props) => {
    const token = useStoreState(state => state.token);

    return (
        <div>
            <UploadForm onSubmit={onSubmit} />
        </div>
    );

    async function onSubmit(fileRequest: FileRequest): Promise<void> {}
};
