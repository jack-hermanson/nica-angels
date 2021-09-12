import { FunctionComponent, useEffect, useState } from "react";
import { HTTP } from "jack-hermanson-ts-utils";
import { useStoreState } from "../../store/_store";
import { PageHeader } from "jack-hermanson-component-lib";
import { Button, Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { SUBMIT_BUTTON_COLOR } from "../../utils/constants";

interface Props {
    errorCode: HTTP.NOT_FOUND | HTTP.FORBIDDEN;
}

export const GenericError: FunctionComponent<Props> = ({
    errorCode,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const [title, setTitle] = useState("");
    const [paragraph, setParagraph] = useState("");

    useEffect(() => {
        if (errorCode === HTTP.NOT_FOUND) {
            setTitle(
                spanish ? "404 Página no Encontrada" : "404 Page not Found"
            );
            setParagraph(
                spanish
                    ? "El recurso que pidió no se pudo encontrar. Nuestras discuplas."
                    : "The page you requested could not be found. Sorry about that."
            );
        } else if (errorCode === HTTP.FORBIDDEN) {
            setTitle(spanish ? "403 Prohibido" : "403 Forbidden");
            setParagraph(
                spanish
                    ? "No tiene permiso para ver esta página."
                    : "You do not have permission to view this page."
            );
        }
    }, [setTitle, setParagraph, errorCode, spanish]);

    const history = useHistory();

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title={title} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p className="lead">{paragraph}</p>
                    <Button
                        color={SUBMIT_BUTTON_COLOR}
                        onClick={() => {
                            history.goBack();
                        }}
                    >
                        {spanish ? "Regresar" : "Go Back"}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};
