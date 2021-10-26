import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Clearance } from "../../../shared";
import { useStoreState } from "../store/_store";
import { LocalStorage } from "./LocalStorage";

export const useMinClearance = (clearance?: Clearance) => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (window.location.pathname !== "/account") {
            LocalStorage.saveRedirectPath(window.location.pathname);
        } else {
            LocalStorage.removeRedirectPath();
        }

        if (!currentUser) {
            history.replace("/account/login");
        } else {
            if (clearance) {
                if (currentUser.clearance < clearance) {
                    history.replace("/forbidden");
                }
            }
        }
    }, [currentUser, history, clearance]);
};
