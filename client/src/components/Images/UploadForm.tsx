import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import { ChangeEvent, Fragment, FunctionComponent, useState } from "react";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";

interface FileRequest {
    file: File | "";
}

interface Props {}

export const UploadForm: FunctionComponent<Props> = () => {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(
        undefined
    );

    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                console.log(event);
                console.log(uploadedFile);
                uploadedFile?.text().then(a => {
                    console.log(a);
                });
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
};
