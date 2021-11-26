import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { FileRecord } from "../../../../shared";
import { FileClient } from "../../clients/FileClient";
import { useStoreState } from "../../store/_store";
import { LoadingSpinner } from "jack-hermanson-component-lib";

interface Props {
    imageId: number | undefined;
}

export const StudentImage: FunctionComponent<Props> = ({ imageId }) => {
    const [image, setImage] = useState<FileRecord | undefined>(undefined);
    const token = useStoreState(state => state.token);

    useEffect(() => {
        if (imageId && token) {
            FileClient.getOne(imageId, token.data).then(i => setImage(i));
        }
    }, [imageId, setImage, token]);

    return (
        <div>
            {imageId ? (
                <Fragment>
                    {image ? (
                        <img
                            className="img-thumbnail"
                            src={image.data}
                            alt={image.name}
                            style={{ borderRadius: "8px" }}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Fragment>
            ) : (
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
            )}
        </div>
    );
};
