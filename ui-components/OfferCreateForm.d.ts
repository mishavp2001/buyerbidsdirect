import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type OfferCreateFormInputValues = {
    offerAmmount?: number;
    propertyAddress?: string;
    propertyId?: string;
    email?: string;
    phone?: string;
    loanApprovalLetter?: string;
    offerType?: string;
    conditions?: string[];
    appointment?: string;
    seller?: string;
    buyer?: string;
};
export declare type OfferCreateFormValidationValues = {
    offerAmmount?: ValidationFunction<number>;
    propertyAddress?: ValidationFunction<string>;
    propertyId?: ValidationFunction<string>;
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
export declare type OfferCreateFormOverridesProps = {
    OfferCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    offerAmmount?: PrimitiveOverrideProps<TextFieldProps>;
    propertyAddress?: PrimitiveOverrideProps<TextFieldProps>;
    propertyId?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    loanApprovalLetter?: PrimitiveOverrideProps<TextFieldProps>;
    offerType?: PrimitiveOverrideProps<SelectFieldProps>;
    conditions?: PrimitiveOverrideProps<TextFieldProps>;
    appointment?: PrimitiveOverrideProps<TextFieldProps>;
    sellerId?: PrimitiveOverrideProps<TextFieldProps>;
    buyerId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type OfferCreateFormProps = React.PropsWithChildren<{
    overrides?: OfferCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: OfferCreateFormInputValues) => OfferCreateFormInputValues;
    onSuccess?: (fields: OfferCreateFormInputValues) => void;
    onError?: (fields: OfferCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: OfferCreateFormInputValues) => OfferCreateFormInputValues;
    onValidate?: OfferCreateFormValidationValues;
} & React.CSSProperties>;
export default function OfferCreateForm(props: OfferCreateFormProps): React.ReactElement;
