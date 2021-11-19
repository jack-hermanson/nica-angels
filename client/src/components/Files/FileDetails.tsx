import { FunctionComponent, useEffect, useState } from "react";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { FileRecord } from "../../../../shared";
import { FileClient } from "../../clients/FileClient";
import { RouteComponentProps } from "react-router-dom";
import { useStoreState } from "../../store/_store";

interface Props extends RouteComponentProps<{ id: string }> {}

export const FileDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const [file, setFile] = useState<FileRecord | undefined>(undefined);
    const token = useStoreState(state => state.token);

    useEffect(() => {
        if (token) {
            FileClient.getOne(parseInt(match.params.id), token.data).then(f =>
                setFile(f)
            );
        }
    }, [setFile, token, match.params.id]);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="File Details" />
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    {!file ? (
                        <LoadingSpinner />
                    ) : (
                        <div>
                            {file.mimeType.startsWith("image/") && (
                                <img src={file.data} />
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};
