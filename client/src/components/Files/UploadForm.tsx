import { Fragment, FunctionComponent, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import { FileRequest } from "@nica-angels/shared";
import { useStoreState } from "../../store/_store";

interface Props {
    onSubmit: (fileRequest: FileRequest) => Promise<any>;
}

export const UploadForm: FunctionComponent<Props> = ({ onSubmit }: Props) => {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(
        undefined
    );
    const [loading, setLoading] = useState(false);
    const spanish = useStoreState(state => state.spanish);

    return (
        <form
            onSubmit={async event => {
                event.preventDefault();
                if (uploadedFile) {
                    setLoading(true);
                    getBase64(uploadedFile).then(async s => {
                        await onSubmit({
                            name: uploadedFile.name,
                            mimeType: uploadedFile.type,
                            data: s,
                        });
                        setLoading(false);
                    });
                }
            }}
        >
            {loading ? (
                <LoadingSpinner />
            ) : (
                <Fragment>
                    {renderFileUpload()}
                    {renderSubmit()}
                </Fragment>
            )}
        </form>
    );

    function renderFileUpload() {
        const id = "file-upload-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label">
                    {spanish ? "Archivo" : "File"}
                </Label>
                <Input
                    type="file"
                    onChange={event => {
                        setUploadedFile(
                            event.currentTarget.files
                                ? event.currentTarget.files[0]
                                : undefined
                        );
                    }}
                />
            </FormGroup>
        );
    }

    function renderSubmit() {
        return (
            <div className="bottom-buttons">
                <Button color={SUBMIT_BUTTON_COLOR} type="submit">
                    {spanish ? "Entregar" : "Submit"}
                </Button>
            </div>
        );
    }

    function getBase64(file: File): Promise<string> {
        return new Promise(resolve => {
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            reader.onload = () => {
                // Make a fileInfo Object
                baseURL = reader.result as string;
                resolve(baseURL);
            };
        });
    }
};
