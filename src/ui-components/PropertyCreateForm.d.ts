import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type PropertyCreateFormInputValues = {
    address?: string;
    position?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    lotSize?: number;
    yearBuilt?: number;
    propertyType?: string;
    listingStatus?: string;
    listingOwner?: string;
    ownerContact?: string;
    description?: string;
    photos?: string[];
    virtualTour?: string;
    propertyTax?: number;
    hoaFees?: number;
    mlsNumber?: string;
    zestimate?: number;
    neighborhood?: string;
    amenities?: string[];
};
export declare type PropertyCreateFormValidationValues = {
    address?: ValidationFunction<string>;
    position?: ValidationFunction<string>;
    price?: ValidationFunction<number>;
    bedrooms?: ValidationFunction<number>;
    bathrooms?: ValidationFunction<number>;
    squareFootage?: ValidationFunction<number>;
    lotSize?: ValidationFunction<number>;
    yearBuilt?: ValidationFunction<number>;
    propertyType?: ValidationFunction<string>;
    listingStatus?: ValidationFunction<string>;
    listingOwner?: ValidationFunction<string>;
    ownerContact?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    photos?: ValidationFunction<string>;
    virtualTour?: ValidationFunction<string>;
    propertyTax?: ValidationFunction<number>;
    hoaFees?: ValidationFunction<number>;
    mlsNumber?: ValidationFunction<string>;
    zestimate?: ValidationFunction<number>;
    neighborhood?: ValidationFunction<string>;
    amenities?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PropertyCreateFormOverridesProps = {
    PropertyCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    position?: PrimitiveOverrideProps<TextAreaFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    bedrooms?: PrimitiveOverrideProps<TextFieldProps>;
    bathrooms?: PrimitiveOverrideProps<TextFieldProps>;
    squareFootage?: PrimitiveOverrideProps<TextFieldProps>;
    lotSize?: PrimitiveOverrideProps<TextFieldProps>;
    yearBuilt?: PrimitiveOverrideProps<TextFieldProps>;
    propertyType?: PrimitiveOverrideProps<TextFieldProps>;
    listingStatus?: PrimitiveOverrideProps<TextFieldProps>;
    listingOwner?: PrimitiveOverrideProps<TextFieldProps>;
    ownerContact?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    photos?: PrimitiveOverrideProps<TextFieldProps>;
    virtualTour?: PrimitiveOverrideProps<TextFieldProps>;
    propertyTax?: PrimitiveOverrideProps<TextFieldProps>;
    hoaFees?: PrimitiveOverrideProps<TextFieldProps>;
    mlsNumber?: PrimitiveOverrideProps<TextFieldProps>;
    zestimate?: PrimitiveOverrideProps<TextFieldProps>;
    neighborhood?: PrimitiveOverrideProps<TextFieldProps>;
    amenities?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PropertyCreateFormProps = React.PropsWithChildren<{
    overrides?: PropertyCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PropertyCreateFormInputValues) => PropertyCreateFormInputValues;
    onSuccess?: (fields: PropertyCreateFormInputValues) => void;
    onError?: (fields: PropertyCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PropertyCreateFormInputValues) => PropertyCreateFormInputValues;
    onValidate?: PropertyCreateFormValidationValues;
} & React.CSSProperties>;
export default function PropertyCreateForm(props: PropertyCreateFormProps): React.ReactElement;
