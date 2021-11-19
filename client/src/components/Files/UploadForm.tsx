import { Fragment, FunctionComponent, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { FileClient } from "../../clients/FileClient";
import { useStoreState } from "../../store/_store";
import { useHistory } from "react-router-dom";
import { LoadingSpinner } from "jack-hermanson-component-lib";

export const UploadForm: FunctionComponent = () => {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(
        undefined
    );
    const [loading, setLoading] = useState(false);
    const token = useStoreState(state => state.token);

    const history = useHistory();

    return (
        <form
            onSubmit={async event => {
                event.preventDefault();
                if (uploadedFile && token) {
                    getBase64(uploadedFile).then(async s => {
                        const createdFile = await FileClient.create(
                            {
                                name: uploadedFile.name,
                                mimeType: uploadedFile.type,
                                data: s,
                            },
                            token.data
                        );
                        history.push(`/settings/files/${createdFile.id}`);
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
                    File
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
                    Submit
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
