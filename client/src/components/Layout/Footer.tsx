import { FunctionComponent } from "react";
import { CONTAINER_FLUID } from "../../utils/constants";
import { Button, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/_store";

export const Footer: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const setSpanish = useStoreActions(actions => actions.setSpanish);

    return (
        <div className="footer-container bg-secondary">
            <Container className="pb-3 pt-2 mt-2" fluid={CONTAINER_FLUID}>
                <Row>
                    <Col className="text-muted d-flex">
                        {renderHome()}
                        {renderSpanishToggle()}
                    </Col>
                </Row>
            </Container>
        </div>
    );

    function renderHome() {
        return (
            <Link className="text-light me-3" to="/">
                {spanish ? "Inicio" : "Home"}
            </Link>
        );
    }

    function renderSpanishToggle() {
        return (
            <a
                href="#"
                className="ms-auto text-light"
                onClick={e => {
                    e.preventDefault();
                    setSpanish(!spanish);
                }}
            >
                {spanish ? "English" : "Español"}
            </a>
        );
    }
};
