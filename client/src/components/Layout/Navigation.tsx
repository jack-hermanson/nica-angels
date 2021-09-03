import { FC, useCallback, useState } from "react";
import {
    Collapse,
    Container,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
} from "reactstrap";
import { APP_NAME, CONTAINER_FLUID, ICON_CLASSES } from "../../utils/constants";
import { useHistory } from "react-router-dom";
import {
    FaCogs,
    FaFileCsv,
    FaHandHoldingHeart,
    FaHandsHelping,
    FaSchool,
    FaUser,
    FaUserGraduate,
} from "react-icons/fa";
import { NavbarLink } from "../Utils/NavbarLink";
import { useStoreState } from "../../store/_store";

export const Navigation: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen(o => !o), [setIsOpen]);
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);
    const history = useHistory();
    const spanish = useStoreState(state => state.spanish);
    const currentUser = useStoreState(state => state.currentUser);

    return (
        <Navbar dark color="secondary" className="mb-1 px-0" expand="lg">
            <Container fluid={CONTAINER_FLUID}>
                <NavbarBrand
                    className="d-flex hover-mouse"
                    onClick={() => {
                        history.push("/");
                        setIsOpen(false);
                    }}
                >
                    <FaHandsHelping className="me-2 my-auto" />
                    <div className="my-auto">{APP_NAME}</div>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar style={{ marginRight: "auto" }}>
                        <NavbarLink
                            to={"/schools"}
                            onClick={close}
                            icon={<FaSchool className={ICON_CLASSES} />}
                            text={spanish ? "Escuelas" : "Schools"}
                        />
                        <NavbarLink
                            to={"/students"}
                            onClick={close}
                            icon={<FaUserGraduate className={ICON_CLASSES} />}
                            text={spanish ? "Estudiantes" : "Students"}
                        />
                        <NavbarLink
                            to={"/sponsors"}
                            onClick={close}
                            icon={
                                <FaHandHoldingHeart className={ICON_CLASSES} />
                            }
                            text={spanish ? "Padrinos" : "Sponsors"}
                        />
                        <NavbarLink
                            to={"/reports"}
                            onClick={close}
                            icon={<FaFileCsv className={ICON_CLASSES} />}
                            text={spanish ? "Reportes" : "Reports"}
                        />
                        <NavbarLink
                            to={"/settings"}
                            onClick={close}
                            icon={<FaCogs className={ICON_CLASSES} />}
                            text={spanish ? "Configuración" : "Settings"}
                        />
                    </Nav>
                    <Nav navbar style={{ marginLeft: "auto" }}>
                        {renderAccount()}
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );

    function renderAccount() {
        return (
            <NavbarLink
                to={"/account"}
                onClick={close}
                icon={<FaUser className={ICON_CLASSES} />}
                text={
                    currentUser
                        ? currentUser.email
                        : spanish
                        ? "Cuenta"
                        : "Account"
                }
            />
        );
    }
};
