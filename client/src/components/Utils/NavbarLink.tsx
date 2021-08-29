import React, { ReactNode } from "react";
import { NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";

interface Props {
    to: string;
    onClick: () => any;
    icon: ReactNode;
    text: string;
}

export const NavbarLink: React.FC<Props> = ({
    to,
    onClick,
    icon,
    text,
}: Props) => {
    return (
        <NavItem>
            <NavLink to={to} onClick={onClick} className="nav-link d-flex">
                {icon}
                {text}
            </NavLink>
        </NavItem>
    );
};
