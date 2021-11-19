import { FunctionComponent, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";
import { FileClient } from "../../clients/FileClient";
import { useStoreState } from "../../store/_store";

interface Props {}

export const UploadForm: FunctionComponent<Props> = () => {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(
        undefined
    );
    const token = useStoreState(state => state.token);

    return (
        <form
            onSubmit={async event => {
                event.preventDefault();
                console.log(event);
                console.log(uploadedFile);
                if (uploadedFile && token) {
                    console.log("submitting");
                    getBase64(uploadedFile).then(async s => {
                        const createdFile = await FileClient.create(
                            {
                                name: uploadedFile.name,
                                mimeType: uploadedFile.type,
                                data: s,
                            },
                            token.data
                        );
                        console.log("submitted");
                        console.log(createdFile);
                    });
                }
            }}
        >
            {renderFileUpload()}
            {renderSubmit()}
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
            let fileInfo;
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                console.log("Called", reader);
                baseURL = reader.result as string;
                console.log(baseURL);
                resolve(baseURL);
            };
            console.log(fileInfo);
        });
    }
};
