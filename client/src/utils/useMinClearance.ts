import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Clearance } from "../../../shared/enums";
import { useStoreState } from "../store/_store";

export const useMinClearance = (clearance?: Clearance) => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
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
