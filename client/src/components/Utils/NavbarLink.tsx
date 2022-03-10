import React, { ReactNode } from "react";
import { NavItem } from "reactstrap";
import { NavLink, useLocation } from "react-router-dom";

interface Props {
    to: string;
    onClick: () => any;
    icon: ReactNode;
    text: string;
    activePaths?: string[];
}

export const NavbarLink: React.FC<Props> = ({
    to,
    onClick,
    icon,
    text,
    activePaths,
}: Props) => {
    const { pathname } = useLocation();

    return (
        <NavItem>
            <NavLink
                isActive={isActive}
                to={to}
                onClick={onClick}
                className="nav-link d-flex"
            >
                {icon}
                {text}
            </NavLink>
        </NavItem>
    );

    function isActive(): boolean {
        const pathsToMatch = activePaths || [to];
        return pathsToMatch.includes(pathname);
    }
};
