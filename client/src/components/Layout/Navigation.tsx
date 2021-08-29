import { FC, useCallback, useState } from "react";
import {
    Collapse,
    Container,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
} from "reactstrap";
import { APP_NAME, CONTAINER_FLUID } from "../../utils/constants";
import { NavLink, useHistory } from "react-router-dom";
import {
    FaHandHoldingHeart,
    FaHandsHelping,
    FaHome,
    FaSchool,
    FaUser,
    FaUserGraduate,
} from "react-icons/fa";

export const Navigation: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen(o => !o), [setIsOpen]);
    const history = useHistory();

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
                        <NavItem>
                            <NavLink
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="nav-link d-flex"
                            >
                                <FaHome className="me-2 my-auto" />
                                Home
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                to="/schools"
                                onClick={() => setIsOpen(false)}
                                className="nav-link d-flex"
                            >
                                <FaSchool className="me-2 my-auto" />
                                Schools
                            </NavLink>
                        </NavItem>
                        <NavItem
                            to="/students"
                            onClick={() => setIsOpen(false)}
                            className="nav-link d-flex"
                        >
                            <FaUserGraduate className="me-2 my-auto" />
                            Students
                        </NavItem>
                    </Nav>
                    <Nav navbar style={{ marginLeft: "auto" }}>
                        <NavItem>
                            <NavLink
                                to="/account"
                                onClick={() => setIsOpen(false)}
                                className="nav-link d-flex"
                            >
                                <FaUser className="me-2 my-auto" />
                                Account
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};
