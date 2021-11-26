import { FunctionComponent } from "react";

export const PlaceholderImage: FunctionComponent = () => {
    return (
        <div
            className="col-12 d-flex justify-content-center align-items-center bg-light"
            style={{
                height: "180px",
                fontSize: "2em",
                borderRadius: "8px",
                color: "black",
            }}
        >
            ?
        </div>
    );
};
