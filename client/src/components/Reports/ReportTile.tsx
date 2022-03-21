import { FunctionComponent } from "react";
import { useStoreState } from "../../store/_store";
import { Button, Card, CardBody } from "reactstrap";
import { ActionCardHeader } from "jack-hermanson-component-lib";
import { Link } from "react-router-dom";
import { FaDownload, FaTable } from "react-icons/all";
import { BUTTON_ICON_CLASSES } from "../../utils/constants";

interface Props {
    title: string;
    description: string;
    linkPath: string;
    downloadCsv: () => Promise<any>;
}

export const ReportTile: FunctionComponent<Props> = ({
    title,
    description,
    linkPath,
    downloadCsv,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <Card>
            <ActionCardHeader title={title} />
            <CardBody>
                <p className="mb-0">{description}</p>
                <div className="d-grid col-12 mt-3">
                    <Link
                        to={linkPath}
                        className={`btn btn-sm btn-success mb-2 icon-button`}
                    >
                        <FaTable className={BUTTON_ICON_CLASSES} />
                        {spanish ? "Ver Reporte" : "View Report"}
                    </Link>
                    <Button
                        color="primary"
                        size="sm"
                        className="icon-button"
                        onClick={async () => {
                            await downloadCsv();
                        }}
                    >
                        <FaDownload className={BUTTON_ICON_CLASSES} />
                        {spanish ? "Bajar CSV" : "Download CSV"}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};
