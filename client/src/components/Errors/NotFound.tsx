import { FunctionComponent } from "react";
import { GenericError } from "./GenericError";
import { HTTP } from "jack-hermanson-ts-utils";

export const NotFound: FunctionComponent = () => {
    return <GenericError errorCode={HTTP.NOT_FOUND} />;
};
