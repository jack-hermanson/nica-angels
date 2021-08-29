import { FC, Fragment, ReactNode } from "react";
import { Container } from "reactstrap";
import { Navigation } from "./Navigation";
import { CONTAINER_FLUID } from "../../utils/constants";

interface Props {
    children: ReactNode;
}

export const Layout: FC<Props> = ({ children }: Props) => {
    return (
        <Fragment>
            <div className="body-container">
                <Navigation />
                <Container className="main-container" fluid={CONTAINER_FLUID}>
                    {children}
                </Container>
            </div>
        </Fragment>
    );
};
