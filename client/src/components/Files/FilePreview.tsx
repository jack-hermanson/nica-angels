import { FunctionComponent, useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { ActionCardHeader } from "jack-hermanson-component-lib";
import { FileRecord } from "../../../../shared";
import { useStoreState } from "../../store/_store";
import { FileClient } from "../../clients/FileClient";
import { Link } from "react-router-dom";

interface Props {
    id: number;
}

export const FilePreview: FunctionComponent<Props> = ({ id }: Props) => {
    const [file, setFile] = useState<FileRecord | undefined>();
    const token = useStoreState(state => state.token);

    useEffect(() => {
        if (token) {
            FileClient.getOne(id, token.data).then(f => {
                setFile(f);
            });
        }
    }, [setFile, token, id]);

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader
                title={file ? file.name : `Loading file ${id}...`}
            />
            <CardBody className="placeholder-glow">
                <Row>
                    <Col xs={4} lg={2} className="mb-3 mb-lg-0">
                        {file ? (
                            <Link to={`/settings/files/${file.id}`}>
                                <img
                                    className="img-thumbnail"
                                    src={file.data}
                                    alt={file.name}
                                />
                            </Link>
                        ) : (
                            <div className="placeholder col-12 h-100" />
                        )}
                    </Col>
                    <Col xs={8} lg={10}>
                        <dl>
                            <dt>Type</dt>
                            <dd>
                                {file ? (
                                    file.mimeType
                                ) : (
                                    <span className="placeholder col-12 col-lg-2" />
                                )}
                            </dd>
                            <dt>Uploaded</dt>
                            <dd className="mb-0">
                                {file ? (
                                    new Date(file.created).toLocaleString()
                                ) : (
                                    <span className="placeholder col-12 col-lg-2" />
                                )}
                            </dd>
                        </dl>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};
