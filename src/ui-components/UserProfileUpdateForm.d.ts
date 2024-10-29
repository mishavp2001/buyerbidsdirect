import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { UserProfile } from "./graphql/types";
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
export declare type UserProfileUpdateFormInputValues = {
    email?: string;
    phone?: string;
    password?: string;
    loanApprovalLetter?: string;
    sellerFinancingOptions?: string;
    chargePerHour?: number;
    userType?: string;
};
export declare type UserProfileUpdateFormValidationValues = {
    email?: ValidationFunction<string>;
    phone?: ValidationFunction<string>;
    password?: ValidationFunction<string>;
    loanApprovalLetter?: ValidationFunction<string>;
    sellerFinancingOptions?: ValidationFunction<string>;
    chargePerHour?: ValidationFunction<number>;
    userType?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserProfileUpdateFormOverridesProps = {
    UserProfileUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    password?: PrimitiveOverrideProps<TextFieldProps>;
    loanApprovalLetter?: PrimitiveOverrideProps<TextFieldProps>;
    sellerFinancingOptions?: PrimitiveOverrideProps<TextFieldProps>;
    chargePerHour?: PrimitiveOverrideProps<TextFieldProps>;
    userType?: PrimitiveOverrideProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type UserProfileUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserProfileUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userProfile?: UserProfile;
    onSubmit?: (fields: UserProfileUpdateFormInputValues) => UserProfileUpdateFormInputValues;
    onSuccess?: (fields: UserProfileUpdateFormInputValues) => void;
    onError?: (fields: UserProfileUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserProfileUpdateFormInputValues) => UserProfileUpdateFormInputValues;
    onValidate?: UserProfileUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserProfileUpdateForm(props: UserProfileUpdateFormProps): React.ReactElement;
