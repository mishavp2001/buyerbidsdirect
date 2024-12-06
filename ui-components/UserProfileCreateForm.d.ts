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
export declare type UserProfileCreateFormInputValues = {
    id?: string;
    name?: string;
    user_role?: string;
    family_name?: string;
    given_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    address?: string;
    email?: string;
    phone_number?: string;
    favorites?: string[];
};
export declare type UserProfileCreateFormValidationValues = {
    id?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    user_role?: ValidationFunction<string>;
    family_name?: ValidationFunction<string>;
    given_name?: ValidationFunction<string>;
    middle_name?: ValidationFunction<string>;
    nickname?: ValidationFunction<string>;
    preferred_username?: ValidationFunction<string>;
    profile?: ValidationFunction<string>;
    picture?: ValidationFunction<string>;
    website?: ValidationFunction<string>;
    gender?: ValidationFunction<string>;
    birthdate?: ValidationFunction<string>;
    zoneinfo?: ValidationFunction<string>;
    locale?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    phone_number?: ValidationFunction<string>;
    favorites?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserProfileCreateFormOverridesProps = {
    UserProfileCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    id?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    user_role?: PrimitiveOverrideProps<SelectFieldProps>;
    family_name?: PrimitiveOverrideProps<TextFieldProps>;
    given_name?: PrimitiveOverrideProps<TextFieldProps>;
    middle_name?: PrimitiveOverrideProps<TextFieldProps>;
    nickname?: PrimitiveOverrideProps<TextFieldProps>;
    preferred_username?: PrimitiveOverrideProps<TextFieldProps>;
    profile?: PrimitiveOverrideProps<TextFieldProps>;
    picture?: PrimitiveOverrideProps<TextFieldProps>;
    website?: PrimitiveOverrideProps<TextFieldProps>;
    gender?: PrimitiveOverrideProps<TextFieldProps>;
    birthdate?: PrimitiveOverrideProps<TextFieldProps>;
    zoneinfo?: PrimitiveOverrideProps<TextFieldProps>;
    locale?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phone_number?: PrimitiveOverrideProps<TextFieldProps>;
    favorites?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserProfileCreateFormProps = React.PropsWithChildren<{
    overrides?: UserProfileCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserProfileCreateFormInputValues) => UserProfileCreateFormInputValues;
    onSuccess?: (fields: UserProfileCreateFormInputValues) => void;
    onError?: (fields: UserProfileCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserProfileCreateFormInputValues) => UserProfileCreateFormInputValues;
    onValidate?: UserProfileCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserProfileCreateForm(props: UserProfileCreateFormProps): React.ReactElement;
