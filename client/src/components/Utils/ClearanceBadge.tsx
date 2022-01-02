import { FunctionComponent, useEffect, useState } from "react";
import { Clearance } from "@nica-angels/shared";
import { Badge } from "reactstrap";

interface Props {
    clearance: Clearance;
}

export const ClearanceBadge: FunctionComponent<Props> = ({
    clearance,
}: Props) => {
    const [text, setText] = useState("");
    const [color, setColor] = useState("");

    useEffect(() => {
        switch (clearance) {
            case Clearance.NONE:
                setColor("secondary");
                setText("None");
                break;
            case Clearance.SPONSOR:
                setColor("success");
                setText("Sponsor");
                break;
            case Clearance.ADMIN:
                setColor("info");
                setText("Admin");
                break;
            case Clearance.SUPER_ADMIN:
                setColor("danger");
                setText("SuperAdmin");
                break;
        }
    }, [setText, setColor, clearance]);

    return <Badge color={color}>{text}</Badge>;
};
