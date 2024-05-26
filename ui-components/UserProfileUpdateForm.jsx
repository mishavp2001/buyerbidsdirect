/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getUserProfile } from "./graphql/queries";
import { updateUserProfile } from "./graphql/mutations";
const client = generateClient();
export default function UserProfileUpdateForm(props) {
  const {
    id: idProp,
    userProfile: userProfileModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    email: "",
    phone: "",
    password: "",
    loanApprovalLetter: "",
    sellerFinancingOptions: "",
    chargePerHour: "",
    userType: "",
  };
  const [email, setEmail] = React.useState(initialValues.email);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [password, setPassword] = React.useState(initialValues.password);
  const [loanApprovalLetter, setLoanApprovalLetter] = React.useState(
    initialValues.loanApprovalLetter
  );
  const [sellerFinancingOptions, setSellerFinancingOptions] = React.useState(
    initialValues.sellerFinancingOptions
  );
  const [chargePerHour, setChargePerHour] = React.useState(
    initialValues.chargePerHour
  );
  const [userType, setUserType] = React.useState(initialValues.userType);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userProfileRecord
      ? { ...initialValues, ...userProfileRecord }
      : initialValues;
    setEmail(cleanValues.email);
    setPhone(cleanValues.phone);
    setPassword(cleanValues.password);
    setLoanApprovalLetter(cleanValues.loanApprovalLetter);
    setSellerFinancingOptions(cleanValues.sellerFinancingOptions);
    setChargePerHour(cleanValues.chargePerHour);
    setUserType(cleanValues.userType);
    setErrors({});
  };
  const [userProfileRecord, setUserProfileRecord] =
    React.useState(userProfileModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getUserProfile.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getUserProfile
        : userProfileModelProp;
      setUserProfileRecord(record);
    };
    queryData();
  }, [idProp, userProfileModelProp]);
  React.useEffect(resetStateValues, [userProfileRecord]);
  const validations = {
    email: [],
    phone: [],
    password: [],
    loanApprovalLetter: [],
    sellerFinancingOptions: [],
    chargePerHour: [],
    userType: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          email: email ?? null,
          phone: phone ?? null,
          password: password ?? null,
          loanApprovalLetter: loanApprovalLetter ?? null,
          sellerFinancingOptions: sellerFinancingOptions ?? null,
          chargePerHour: chargePerHour ?? null,
          userType: userType ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateUserProfile.replaceAll("__typename", ""),
            variables: {
              input: {
                id: userProfileRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserProfileUpdateForm")}
      {...rest}
    >
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              phone,
              password,
              loanApprovalLetter,
              sellerFinancingOptions,
              chargePerHour,
              userType,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone: value,
              password,
              loanApprovalLetter,
              sellerFinancingOptions,
              chargePerHour,
              userType,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
      ></TextField>
      <TextField
        label="Password"
        isRequired={false}
        isReadOnly={false}
        value={password}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              password: value,
              loanApprovalLetter,
              sellerFinancingOptions,
              chargePerHour,
              userType,
            };
            const result = onChange(modelFields);
            value = result?.password ?? value;
          }
          if (errors.password?.hasError) {
            runValidationTasks("password", value);
          }
          setPassword(value);
        }}
        onBlur={() => runValidationTasks("password", password)}
        errorMessage={errors.password?.errorMessage}
        hasError={errors.password?.hasError}
        {...getOverrideProps(overrides, "password")}
      ></TextField>
      <TextField
        label="Loan approval letter"
        isRequired={false}
        isReadOnly={false}
        value={loanApprovalLetter}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              password,
              loanApprovalLetter: value,
              sellerFinancingOptions,
              chargePerHour,
              userType,
            };
            const result = onChange(modelFields);
            value = result?.loanApprovalLetter ?? value;
          }
          if (errors.loanApprovalLetter?.hasError) {
            runValidationTasks("loanApprovalLetter", value);
          }
          setLoanApprovalLetter(value);
        }}
        onBlur={() =>
          runValidationTasks("loanApprovalLetter", loanApprovalLetter)
        }
        errorMessage={errors.loanApprovalLetter?.errorMessage}
        hasError={errors.loanApprovalLetter?.hasError}
        {...getOverrideProps(overrides, "loanApprovalLetter")}
      ></TextField>
      <TextField
        label="Seller financing options"
        isRequired={false}
        isReadOnly={false}
        value={sellerFinancingOptions}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              password,
              loanApprovalLetter,
              sellerFinancingOptions: value,
              chargePerHour,
              userType,
            };
            const result = onChange(modelFields);
            value = result?.sellerFinancingOptions ?? value;
          }
          if (errors.sellerFinancingOptions?.hasError) {
            runValidationTasks("sellerFinancingOptions", value);
          }
          setSellerFinancingOptions(value);
        }}
        onBlur={() =>
          runValidationTasks("sellerFinancingOptions", sellerFinancingOptions)
        }
        errorMessage={errors.sellerFinancingOptions?.errorMessage}
        hasError={errors.sellerFinancingOptions?.hasError}
        {...getOverrideProps(overrides, "sellerFinancingOptions")}
      ></TextField>
      <TextField
        label="Charge per hour"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={chargePerHour}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              email,
              phone,
              password,
              loanApprovalLetter,
              sellerFinancingOptions,
              chargePerHour: value,
              userType,
            };
            const result = onChange(modelFields);
            value = result?.chargePerHour ?? value;
          }
          if (errors.chargePerHour?.hasError) {
            runValidationTasks("chargePerHour", value);
          }
          setChargePerHour(value);
        }}
        onBlur={() => runValidationTasks("chargePerHour", chargePerHour)}
        errorMessage={errors.chargePerHour?.errorMessage}
        hasError={errors.chargePerHour?.hasError}
        {...getOverrideProps(overrides, "chargePerHour")}
      ></TextField>
      <SelectField
        label="User type"
        placeholder="Please select an option"
        isDisabled={false}
        value={userType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              phone,
              password,
              loanApprovalLetter,
              sellerFinancingOptions,
              chargePerHour,
              userType: value,
            };
            const result = onChange(modelFields);
            value = result?.userType ?? value;
          }
          if (errors.userType?.hasError) {
            runValidationTasks("userType", value);
          }
          setUserType(value);
        }}
        onBlur={() => runValidationTasks("userType", userType)}
        errorMessage={errors.userType?.errorMessage}
        hasError={errors.userType?.hasError}
        {...getOverrideProps(overrides, "userType")}
      >
        <option
          children="Buyer"
          value="buyer"
          {...getOverrideProps(overrides, "userTypeoption0")}
        ></option>
        <option
          children="Seller"
          value="seller"
          {...getOverrideProps(overrides, "userTypeoption1")}
        ></option>
        <option
          children="Attorney"
          value="attorney"
          {...getOverrideProps(overrides, "userTypeoption2")}
        ></option>
        <option
          children="Agent"
          value="agent"
          {...getOverrideProps(overrides, "userTypeoption3")}
        ></option>
        <option
          children="Notary"
          value="notary"
          {...getOverrideProps(overrides, "userTypeoption4")}
        ></option>
      </SelectField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || userProfileModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || userProfileModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
