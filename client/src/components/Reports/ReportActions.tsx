import { FunctionComponent } from "react";
import { Button } from "reactstrap";
import { FaDownload, FaPrint } from "react-icons/all";
import {
    BUTTON_ICON_CLASSES,
    SUBMIT_BUTTON_COLOR,
} from "../../utils/constants";
import { useStoreState } from "../../store/_store";

interface Props {
    title: string;
    downloadReport: () => any;
}

export const ReportActions: FunctionComponent<Props> = ({
    title,
    downloadReport,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    return (
        <div className="actions">
            <Button
                color="secondary"
                size="sm"
                className="icon-button"
                onClick={() => {
                    document.title = title;
                    window.print();
                    document.title = "Nica Angels";
                }}
            >
                <FaPrint className={BUTTON_ICON_CLASSES} />
                {spanish ? "Imprimir" : "Print"}
            </Button>
            <Button
                color={SUBMIT_BUTTON_COLOR}
                size="sm"
                className="icon-button"
                onClick={downloadReport}
            >
                <FaDownload className={BUTTON_ICON_CLASSES} />
                {spanish ? "Bajar" : "Download"}
            </Button>
        </div>
    );
};
