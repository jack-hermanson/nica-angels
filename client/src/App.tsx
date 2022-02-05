import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./css/main.css";
import { Layout } from "./components/Layout/Layout";
import { AccountPage } from "./components/Account/AccountPage";
import { DashboardPage } from "./components/Dashboard/DashboardPage";
import { RegisterPage } from "./components/Account/RegisterPage";
import { LoginPage } from "./components/Account/LoginPage";
import { useStoreActions } from "./store/_store";
import { LocalStorage } from "./utils/LocalStorage";
import { AccountClient } from "./clients/AccountClient";
import { Alerts } from "./components/Alerts/Alerts";
import { SocketConnection } from "./components/Utils/SocketConnection";
import { Settings } from "./components/Settings/Settings";
import { TownsIndex } from "./components/Towns/TownsIndex";
import { CreateTown } from "./components/Towns/CreateTown";
import { EditTown } from "./components/Towns/EditTown";
import { SchoolsIndex } from "./components/Schools/SchoolsIndex";
import { CreateSchool } from "./components/Schools/CreateSchool";
import { Forbidden } from "./components/Errors/Forbidden";
import { NotFound } from "./components/Errors/NotFound";
import { EditSchool } from "./components/Schools/EditSchool";
import { StudentsIndex } from "./components/Students/StudentsIndex";
import { CreateStudent } from "./components/Students/CreateStudent";
import { EditStudent } from "./components/Students/EditStudent";
import { EnrollmentsIndex } from "./components/Enrollments/EnrollmentsIndex";
import { CreateEnrollment } from "./components/Enrollments/CreateEnrollment";
import { EditEnrollment } from "./components/Enrollments/EditEnrollment";
import { Upload } from "./components/Files/Upload";
import { FileDetails } from "./components/Files/FileDetails";
import { FilesIndex } from "./components/Files/FilesIndex";
import { StudentDetails } from "./components/Students/StudentDetails";
import { UsersIndex } from "./components/User/UsersIndex";
import { UserDetails } from "./components/User/UserDetails";
import { EditUser } from "./components/User/EditUser";
import { ReportsIndex } from "./components/Reports/ReportsIndex";
import { SponsorsIndex } from "./components/Sponsors/SponsorsIndex";
import { CreateSponsor } from "./components/Sponsors/CreateSponsor";
import { EditSponsor } from "./components/Sponsors/EditSponsor";
import { SponsorDetails } from "./components/Sponsors/SponsorDetails";
import { EditAccountPage } from "./components/Account/EditAccountPage";

export const App: React.FC = () => {
    const setToken = useStoreActions(actions => actions.setToken);
    const setCurrentUser = useStoreActions(actions => actions.setCurrentUser);

    useEffect(() => {
        const token = LocalStorage.getToken();
        if (token) {
            setToken(token);
            AccountClient.getAccount(token.accountId, token.data)
                .then(user => {
                    setCurrentUser(user);
                })
                .catch((error: any) => {
                    console.error(error);
                    console.log(error.response?.data);
                    LocalStorage.removeToken();
                });
        }
    }, [setToken, setCurrentUser]);

    return (
        <BrowserRouter>
            <SocketConnection />
            <Layout>
                <Alerts />
                <Switch>
                    <Route exact path="/" component={DashboardPage} />

                    <Route exact path="/account" component={AccountPage} />
                    <Route
                        exact
                        path="/account/register"
                        component={RegisterPage}
                    />
                    <Route exact path="/account/login" component={LoginPage} />
                    <Route
                        exact
                        path="/account/edit"
                        component={EditAccountPage}
                    />

                    <Route exact path="/settings" component={Settings} />

                    <Route
                        exact
                        path="/settings/towns"
                        component={TownsIndex}
                    />
                    <Route
                        exact
                        path="/settings/towns/new"
                        component={CreateTown}
                    />
                    <Route
                        exact
                        path="/settings/towns/edit/:id"
                        component={EditTown}
                    />

                    <Route exact path="/schools" component={SchoolsIndex} />
                    <Route exact path="/schools/new" component={CreateSchool} />
                    <Route
                        exact
                        path="/schools/edit/:id"
                        component={EditSchool}
                    />

                    <Route exact path="/students" component={StudentsIndex} />
                    <Route
                        exact
                        path="/students/new"
                        component={CreateStudent}
                    />
                    <Route
                        exact
                        path="/students/edit/:id"
                        component={EditStudent}
                    />
                    <Route
                        exact
                        path="/students/:id"
                        component={StudentDetails}
                    />

                    <Route
                        exact
                        path="/settings/enrollments"
                        component={EnrollmentsIndex}
                    />
                    <Route
                        exact
                        path="/settings/enrollments/new/:studentId?"
                        component={CreateEnrollment}
                    />
                    <Route
                        exact
                        path="/settings/enrollments/edit/:id"
                        component={EditEnrollment}
                    />

                    <Route
                        exact
                        path="/settings/files"
                        component={FilesIndex}
                    />
                    <Route
                        exact
                        path="/settings/files/upload"
                        component={Upload}
                    />
                    <Route
                        exact
                        path="/settings/files/:id"
                        component={FileDetails}
                    />

                    <Route
                        exact
                        path="/settings/users"
                        component={UsersIndex}
                    />
                    <Route
                        exact
                        path="/settings/users/edit/:id"
                        component={EditUser}
                    />
                    <Route
                        exact
                        path="/settings/users/:id"
                        component={UserDetails}
                    />

                    <Route exact path="/reports" component={ReportsIndex} />

                    <Route exact path="/sponsors" component={SponsorsIndex} />
                    <Route
                        exact
                        path="/sponsors/new"
                        component={CreateSponsor}
                    />
                    <Route
                        exact
                        path="/sponsors/edit/:id"
                        component={EditSponsor}
                    />
                    <Route
                        exact
                        path="/sponsors/:id"
                        component={SponsorDetails}
                    />

                    <Route exact path="/forbidden" component={Forbidden} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};
