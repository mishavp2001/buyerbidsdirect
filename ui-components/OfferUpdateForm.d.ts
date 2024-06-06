import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Offer } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type OfferUpdateFormInputValues = {
    offerAmmount?: number;
    propertyAddress?: string;
    propertyId?: string;
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
    ownerEmail?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    loanApprovalLetter?: string;
    offerType?: string;
    conditions?: string[];
    appointment?: string;
    seller?: string;
    buyer?: string;
};
export declare type OfferUpdateFormValidationValues = {
    offerAmmount?: ValidationFunction<number>;
    propertyAddress?: ValidationFunction<string>;
    propertyId?: ValidationFunction<string>;
    buyerName?: ValidationFunction<string>;
    buyerEmail?: ValidationFunction<string>;
    buyerPhone?: ValidationFunction<string>;
    ownerEmail?: ValidationFunction<string>;
    ownerName?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    phone?: ValidationFunction<string>;
    loanApprovalLetter?: ValidationFunction<string>;
    offerType?: ValidationFunction<string>;
    conditions?: ValidationFunction<string>;
    appointment?: ValidationFunction<string>;
    seller?: ValidationFunction<string>;
    buyer?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type OfferUpdateFormOverridesProps = {
    OfferUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    offerAmmount?: PrimitiveOverrideProps<TextFieldProps>;
    propertyAddress?: PrimitiveOverrideProps<TextFieldProps>;
    propertyId?: PrimitiveOverrideProps<TextFieldProps>;
    buyerName?: PrimitiveOverrideProps<TextFieldProps>;
    buyerEmail?: PrimitiveOverrideProps<TextFieldProps>;
    buyerPhone?: PrimitiveOverrideProps<TextFieldProps>;
    ownerEmail?: PrimitiveOverrideProps<TextFieldProps>;
    ownerName?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    loanApprovalLetter?: PrimitiveOverrideProps<TextFieldProps>;
    offerType?: PrimitiveOverrideProps<SelectFieldProps>;
    conditions?: PrimitiveOverrideProps<TextFieldProps>;
    appointment?: PrimitiveOverrideProps<TextFieldProps>;
    seller?: PrimitiveOverrideProps<TextFieldProps>;
    buyer?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type OfferUpdateFormProps = React.PropsWithChildren<{
    overrides?: OfferUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    offer?: Offer;
    onSubmit?: (fields: OfferUpdateFormInputValues) => OfferUpdateFormInputValues;
    onSuccess?: (fields: OfferUpdateFormInputValues) => void;
    onError?: (fields: OfferUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: OfferUpdateFormInputValues) => OfferUpdateFormInputValues;
    onValidate?: OfferUpdateFormValidationValues;
} & React.CSSProperties>;
export default function OfferUpdateForm(props: OfferUpdateFormProps): React.ReactElement;
