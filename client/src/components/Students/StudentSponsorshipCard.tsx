import { FunctionComponent, useEffect, useState } from "react";
import { SponsorRecord, SponsorshipRecord } from "@nica-angels/shared";
import { Link } from "react-router-dom";
import { SponsorshipClient } from "../../clients/SponsorshipClient";
import { useStoreState } from "../../store/_store";
import { SponsorClient } from "../../clients/SponsorClient";
import { Card, CardBody, CardFooter } from "reactstrap";
import { ActionCardHeader, KeyValCardBody } from "jack-hermanson-component-lib";
import { BUTTON_ICON_CLASSES, NEW_BUTTON_COLOR } from "../../utils/constants";
import { FaPlus } from "react-icons/fa";

interface Props {
    studentId: number;
    className?: string;
}

export const StudentSponsorshipCard: FunctionComponent<Props> = ({
    studentId,
    className,
}: Props) => {
    const token = useStoreState(state => state.token);

    const [sponsor, setSponsor] = useState<SponsorRecord | undefined>(
        undefined
    );
    const [sponsorship, setSponsorship] = useState<
        SponsorshipRecord | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getOneFromStudentId(studentId, token.data).then(
                sponsorshipData => {
                    if (sponsorshipData) {
                        setSponsorship(sponsorshipData);
                    }
                }
            );
        }
    }, [setSponsorship, token, studentId]);

    useEffect(() => {
        if (sponsorship && token) {
            SponsorClient.getOne(sponsorship.sponsorId, token.data).then(
                sponsorData => {
                    setSponsor(sponsorData);
                }
            );
        }
    }, [sponsorship, token, setSponsor]);

    return (
        <Card className={className || ""}>
            <ActionCardHeader title="Sponsorship">
                {!sponsorship && (
                    <Link
                        to={`/settings/sponsorships/new`}
                        className={`btn btn-sm btn-${NEW_BUTTON_COLOR}`}
                    >
                        <FaPlus className={BUTTON_ICON_CLASSES} />
                        New Sponsorship
                    </Link>
                )}
            </ActionCardHeader>
            {sponsorship && sponsor ? (
                <KeyValCardBody
                    keyValPairs={[
                        {
                            key: "Sponsor",
                            val: (
                                <Link
                                    to={`/sponsors/${sponsor.id}`}
                                    className="px-0"
                                >
                                    {sponsor.firstName} {sponsor.lastName}
                                </Link>
                            ),
                        },
                    ]}
                />
            ) : (
                <CardBody>
                    <p className="mb-0">
                        This student does not have a sponsor.
                    </p>
                </CardBody>
            )}
            {sponsorship && (
                <CardFooter>
                    <Link
                        className="px-0"
                        to={`/settings/sponsorships/edit/${sponsorship.id}`}
                    >
                        Edit Sponsorship
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
};
