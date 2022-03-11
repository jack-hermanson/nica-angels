import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { SettingsTabs } from "../Settings/SettingsTabs";
import { Card, CardBody, Col, Row } from "reactstrap";
import {
    ActionsDropdown,
    KeyValCardBody,
    KeyValTable,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../store/_store";
import { AccountRecord, Clearance } from "@nica-angels/shared";
import { useMinClearance } from "../../utils/useMinClearance";
import { AccountClient } from "../../clients/AccountClient";
import { ClearanceBadge } from "../Utils/ClearanceBadge";
import moment from "moment";
import {
    ClickDropdownAction,
    LinkDropdownAction,
} from "jack-hermanson-ts-utils";
import { PromoteClearanceModal } from "./PromoteClearanceModal";

interface Props extends RouteComponentProps<{ id: string }> {}

export const UserDetails: FunctionComponent<Props> = ({ match }: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);
    const currentUser = useStoreState(state => state.currentUser);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const [user, setUser] = useState<AccountRecord | undefined>(undefined);
    const [numTokens, setNumTokens] = useState<number | undefined>(undefined);
    const [showPromotionModal, setShowPromotionModal] = useState(false);

    const history = useHistory();

    useMinClearance(Clearance.ADMIN);

    useEffect(() => {
        if (token) {
            AccountClient.getAccount(
                parseInt(match.params.id),
                token.data
            ).then(data => {
                setUser(data);
            });

            AccountClient.getTokens(parseInt(match.params.id), token.data).then(
                data => {
                    setNumTokens(data);
                }
            );
        }
    }, [setUser, token, setNumTokens, match.params.id]);

    return (
        <div>
            <SettingsTabs />
            {renderPageHeader()}
            {renderUserInfo()}
            {renderPromoteModal()}
        </div>
    );

    function renderPageHeader() {
        const options = [];
        if (user) {
            options.push(
                new LinkDropdownAction(
                    spanish ? "Editar" : "Edit",
                    `/settings/users/edit/${user.id}`
                )
            );
        }
        if (currentUser && currentUser.clearance >= Clearance.SUPER_ADMIN) {
            options.push(
                new ClickDropdownAction("Clearance", () => {
                    setShowPromotionModal(true);
                })
            );
        }
        return (
            <Row>
                <Col>
                    <PageHeader
                        title={
                            spanish ? "Detalles del Usuario" : "User Details"
                        }
                    >
                        {user && (
                            <ActionsDropdown
                                size="sm"
                                options={options}
                                menuName={spanish ? "Acciones" : "Actions"}
                            />
                        )}
                    </PageHeader>
                </Col>
            </Row>
        );
    }

    function renderUserInfo() {
        return (
            <Row>
                <Col>
                    {user ? (
                        <Card>
                            <KeyValCardBody
                                keyValPairs={[
                                    {
                                        key: spanish ? "Nombre" : "Name",
                                        val: `${user.firstName} ${user.lastName}`,
                                    },
                                    {
                                        key: spanish
                                            ? "Correo Electrónico"
                                            : "Email",
                                        val: user.email,
                                    },
                                    {
                                        key: "Tokens",
                                        val:
                                            numTokens === undefined
                                                ? "..."
                                                : numTokens,
                                    },
                                    {
                                        key: spanish
                                            ? "Autorización"
                                            : "Clearance",
                                        val: (
                                            <ClearanceBadge
                                                clearance={user.clearance}
                                            />
                                        ),
                                    },
                                    {
                                        key: spanish ? "Creado" : "Created",
                                        val: moment(user.created)
                                            .toDate()
                                            .toLocaleString(),
                                    },
                                    {
                                        key: spanish
                                            ? "Actualizado"
                                            : "Updated",
                                        val: moment(user.updated)
                                            .toDate()
                                            .toLocaleString(),
                                    },
                                ]}
                            />
                        </Card>
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        );
    }

    function renderPromoteModal() {
        if (
            user &&
            currentUser &&
            currentUser.clearance >= Clearance.SUPER_ADMIN
        ) {
            return (
                <PromoteClearanceModal
                    user={user}
                    isOpen={showPromotionModal}
                    setIsOpen={setShowPromotionModal}
                    callback={() => {
                        addAlert({
                            text: "Clearance updated successfully.",
                            color: "success",
                        });
                        history.push("/settings/users");
                    }}
                />
            );
        }
    }
};
