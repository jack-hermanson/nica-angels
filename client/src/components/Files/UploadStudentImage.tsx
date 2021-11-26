import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";

interface Props {
    studentId: number;
}

export const UploadStudentImage: FunctionComponent<Props> = ({
    studentId,
}: Props) => {
    const token = useStoreState(state => state.token);

    return <div></div>;
};
