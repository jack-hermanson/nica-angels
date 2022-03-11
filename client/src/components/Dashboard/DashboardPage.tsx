import { Fragment, FunctionComponent } from "react";
import { Col, Row } from "reactstrap";
import { useStoreState } from "../../store/_store";
import { Link } from "react-router-dom";
import { StudentStats } from "./StudentStats";
import { Clearance } from "@nica-angels/shared";
import { SponsorStats } from "./SponsorStats";
import { AverageDonationStats } from "./AverageDonationStats";

export const DashboardPage: FunctionComponent = () => {
    const spanish = useStoreState(state => state.spanish);
    const currentUser = useStoreState(state => state.currentUser);

    return (
        <div>
            <Row>
                <Col>
                    <h1 className="display-2 fw-bold mb-4 mt-2">
                        {!currentUser ? (
                            <Fragment>
                                {spanish
                                    ? "Bienvenido a Nica Angels"
                                    : "Welcome to Nica Angels"}
                            </Fragment>
                        ) : (
                            <Fragment>
                                {spanish ? "Bienvenido" : "Welcome"},{" "}
                                {currentUser.firstName}
                            </Fragment>
                        )}
                    </h1>
                    <hr
                        className="mb-3"
                        style={{
                            height: "1px",
                            backgroundColor: "white",
                            opacity: 1,
                        }}
                    />
                </Col>
            </Row>
            {currentUser ? (
                <Fragment>
                    <Row className="mt-4">
                        {currentUser.clearance >= Clearance.SPONSOR ? (
                            <Fragment>
                                <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                                    <StudentStats />
                                </Col>
                                <Col xs={12} lg={4} className="mb-3 mb-lg-0">
                                    <SponsorStats />
                                </Col>
                                <Col xs={12} lg={4}>
                                    <AverageDonationStats />
                                </Col>
                            </Fragment>
                        ) : (
                            <Col>
                                <p className="lead">
                                    Your account is not verified.
                                </p>
                            </Col>
                        )}
                    </Row>
                </Fragment>
            ) : (
                <Fragment>
                    <Row>
                        <Col>
                            <p className="lead mt-3">
                                {spanish
                                    ? "Esta aplicación se usa para dirigir las operaciones de la organización."
                                    : "This app is used to manage the operations of the organization."}
                            </p>
                            <p className="lead">
                                {spanish ? (
                                    <Fragment>
                                        Para continuar, favor de{" "}
                                        <Link
                                            to="/account/login"
                                            className="underlined"
                                        >
                                            iniciar una sesión
                                        </Link>{" "}
                                        o{" "}
                                        <Link
                                            to="/account/register"
                                            className="underlined"
                                        >
                                            crear una cuenta
                                        </Link>
                                        .
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        To continue, please{" "}
                                        <Link
                                            to="/account/login"
                                            className="underlined"
                                        >
                                            log in
                                        </Link>{" "}
                                        or{" "}
                                        <Link
                                            to="/account/register"
                                            className="underlined"
                                        >
                                            create an account
                                        </Link>
                                        .
                                    </Fragment>
                                )}
                            </p>
                        </Col>
                    </Row>
                </Fragment>
            )}
        </div>
    );
};
