import {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { useStoreState } from "../../store/_store";
import { LoadingSpinner, MobileToggleCard } from "jack-hermanson-component-lib";
import { ExpandedSponsorshipRecord, PaymentRecord } from "@nica-angels/shared";
import { Form, Formik, Field, FormikProps } from "formik";
import { CardBody, FormGroup, Input, Label } from "reactstrap";
import { SponsorshipClient } from "../../clients/SponsorshipClient";

interface Props {
    setFilteredPayments: Dispatch<SetStateAction<PaymentRecord[] | undefined>>;
    payments: PaymentRecord[];
}

interface FormValues {
    sponsorshipId: string;
}

export const FilterPayments: FunctionComponent<Props> = ({
    setFilteredPayments,
    payments,
}: Props) => {
    const spanish = useStoreState(state => state.spanish);
    const token = useStoreState(state => state.token);

    const [sponsorships, setSponsorships] = useState<
        ExpandedSponsorshipRecord[] | undefined
    >(undefined);

    useEffect(() => {
        if (token) {
            SponsorshipClient.getExpandedSponsorships(token.data).then(data => {
                setSponsorships(data);
            });
        }
    }, [setSponsorships, token]);

    return (
        <MobileToggleCard cardTitle={spanish ? "Buscar" : "Filtering"}>
            <CardBody>
                {sponsorships ? (
                    <Formik
                        initialValues={{
                            sponsorshipId: "",
                        }}
                        onSubmit={console.log}
                        onReset={() => console.log("reset")}
                    >
                        {({ handleChange }: FormikProps<FormValues>) => (
                            <Form>{renderSponsorshipId(handleChange)}</Form>
                        )}
                    </Formik>
                ) : (
                    <LoadingSpinner />
                )}
            </CardBody>
        </MobileToggleCard>
    );

    function renderSponsorshipId(
        handleChange: (changeEvent: ChangeEvent<any>) => any
    ) {
        const id = "sponsorship-id-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    {spanish ? "Patrocinio" : "Sponsorship"}
                </Label>
                <Field
                    as={Input}
                    type="select"
                    name="sponsorshipId"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleChange(event);
                        if (event.target.value.trim() !== "") {
                            const newFilteredPayments = payments.filter(p => {
                                return (
                                    p.sponsorshipId ===
                                    parseInt(event.target.value)
                                );
                            });
                            setFilteredPayments(newFilteredPayments);
                        } else {
                            setFilteredPayments(payments);
                        }
                    }}
                >
                    <option value="">Select...</option>
                    {sponsorships &&
                        sponsorships.map(sponsorship => (
                            <option value={sponsorship.id} key={sponsorship.id}>
                                (#{sponsorship.id}) {sponsorship.sponsorName} /{" "}
                                {sponsorship.studentName}
                            </option>
                        ))}
                </Field>
            </FormGroup>
        );
    }
};
