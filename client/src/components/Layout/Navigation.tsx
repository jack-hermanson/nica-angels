import { FC, Fragment, useCallback, useState } from "react";
import {
    Collapse,
    Container,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
} from "reactstrap";
import {
    APP_NAME,
    CONTAINER_FLUID,
    NAV_ICON_CLASSES,
} from "../../utils/constants";
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
import { Clearance } from "../../../../shared";

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
                        {currentUser &&
                            currentUser.clearance >= Clearance.SPONSOR && (
                                <Fragment>
                                    <NavbarLink
                                        to={"/schools"}
                                        onClick={close}
                                        icon={
                                            <FaSchool
                                                className={NAV_ICON_CLASSES}
                                            />
                                        }
                                        text={spanish ? "Escuelas" : "Schools"}
                                    />
                                    <NavbarLink
                                        to={"/students"}
                                        onClick={close}
                                        icon={
                                            <FaUserGraduate
                                                className={NAV_ICON_CLASSES}
                                            />
                                        }
                                        text={
                                            spanish ? "Estudiantes" : "Students"
                                        }
                                    />
                                </Fragment>
                            )}

                        {renderSponsors()}
                        {renderReports()}
                        {renderSettings()}
                    </Nav>
                    <Nav navbar style={{ marginLeft: "auto" }}>
                        {renderAccount()}
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );

    function renderSponsors() {
        if (
            currentUser?.clearance &&
            currentUser.clearance >= Clearance.ADMIN
        ) {
            return (
                <NavbarLink
                    to={"/sponsors"}
                    onClick={close}
                    icon={<FaHandHoldingHeart className={NAV_ICON_CLASSES} />}
                    text={spanish ? "Padrinos" : "Sponsors"}
                />
            );
        }
    }

    function renderAccount() {
        return (
            <NavbarLink
                to={"/account"}
                onClick={close}
                icon={<FaUser className={NAV_ICON_CLASSES} />}
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

    function renderSettings() {
        if (
            currentUser?.clearance &&
            currentUser.clearance >= Clearance.ADMIN
        ) {
            return (
                <NavbarLink
                    to={"/settings"}
                    onClick={close}
                    icon={<FaCogs className={NAV_ICON_CLASSES} />}
                    text={spanish ? "Configuración" : "Settings"}
                />
            );
        }
    }

    function renderReports() {
        if (
            currentUser?.clearance &&
            currentUser.clearance >= Clearance.ADMIN
        ) {
            return (
                <NavbarLink
                    to={"/reports"}
                    onClick={close}
                    icon={<FaFileCsv className={NAV_ICON_CLASSES} />}
                    text={spanish ? "Reportes" : "Reports"}
                />
            );
        }
    }
};
