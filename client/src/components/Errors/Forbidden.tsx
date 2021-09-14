import { FunctionComponent } from "react";
import { GenericError } from "./GenericError";
import { HTTP } from "jack-hermanson-ts-utils";

export const Forbidden: FunctionComponent = () => {
    return <GenericError errorCode={HTTP.FORBIDDEN} />;
};
