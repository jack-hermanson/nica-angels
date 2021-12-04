import { FunctionComponent } from "react";
import profilePic from "../../images/profile-pic.svg";

export const PlaceholderImage: FunctionComponent = () => {
    return (
        <img
            className="img-thumbnail"
            src={profilePic}
            alt={"No profile avatar uploaded"}
            style={{ borderRadius: "8px" }}
        />
    );
};
