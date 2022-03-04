import { FunctionComponent } from "react";
import {
    getIdPadded,
    SponsorRecord,
    SponsorshipRecord,
    StudentRecord,
} from "@nica-angels/shared";
import { Link } from "react-router-dom";
import { DATE_FORMAT, ID_PADDING } from "../../utils/constants";
import moment from "moment";
import { KeyValCardBody } from "jack-hermanson-component-lib";
import { useStoreState } from "../../store/_store";

interface Props {
    sponsor: SponsorRecord;
    student: StudentRecord;
    sponsorship: SponsorshipRecord;
}

/**
 * Will render a KeyValCardBody component with sponsorship info.
 */
export const SponsorshipCardBody: FunctionComponent<Props> = ({
    sponsor,
    student,
    sponsorship,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);

    const keyValPairs = [
        {
            key: spanish ? "Estudiante" : "Student",
            val: (
                <Link className="ps-0" to={`/students/${student.id}`}>
                    {student.firstName} {student.middleName} {student.lastName}{" "}
                    (#
                    {getIdPadded(student, ID_PADDING)})
                </Link>
            ),
        },
        {
            key: spanish ? "Padrino" : "Sponsor",
            val: (
                <Link className="ps-0" to={`/sponsors/${sponsor.id}`}>
                    {sponsor.firstName} {sponsor.lastName}
                </Link>
            ),
        },
        {
            key: spanish ? "Pago" : "Payment",
            val: `$${sponsorship.payment}`,
        },
        {
            key: spanish ? "Frecuencia" : "Frequency",
            val: `${sponsorship.frequency}/${spanish ? "año" : "year"}`,
        },
        {
            key: spanish ? "Fecha de Comienza" : "Start Date",
            val: moment(sponsorship.startDate).format(DATE_FORMAT),
        },
    ];
    if (sponsorship.endDate) {
        keyValPairs.push({
            key: spanish ? "Fecha de Cierre" : "End Date",
            val: moment(sponsorship.endDate).format(DATE_FORMAT),
        });
    }
    return <KeyValCardBody keyValPairs={keyValPairs} />;
};
