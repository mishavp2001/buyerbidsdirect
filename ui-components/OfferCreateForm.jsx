/* eslint-disable */
"use client";
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SelectField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createOffer } from "./graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function OfferCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    offerAmmount: "",
    propertyAddress: "",
    email: "",
    phone: "",
    loanApprovalLetter: "",
    offerType: "",
    conditions: [],
    appointment: "",
    propertyId: overrides?.propertyId?.value,
    seller: overrides?.seller?.value,
    buyer: overrides?.buyer?.value,
  };
  const [offerAmmount, setOfferAmmount] = React.useState(
    initialValues.offerAmmount
  );
  const [propertyAddress, setPropertyAddress] = React.useState(
    initialValues.propertyAddress
  );
  const [propertyId, setPropertyId] = React.useState(initialValues.propertyId);
  const [email, setEmail] = React.useState(initialValues.email);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [loanApprovalLetter, setLoanApprovalLetter] = React.useState(
    initialValues.loanApprovalLetter
  );
  const [offerType, setOfferType] = React.useState(initialValues.offerType);
  const [conditions, setConditions] = React.useState(initialValues.conditions);
  const [appointment, setAppointment] = React.useState(
    initialValues.appointment
  );
  const [seller, setSeller] = React.useState(initialValues.seller);
  const [buyer, setBuyer] = React.useState(initialValues.buyer);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setOfferAmmount(initialValues.offerAmmount);
    setPropertyAddress(initialValues.propertyAddress);
    setPropertyId(initialValues.propertyId);
    setEmail(initialValues.email);
    setPhone(initialValues.phone);
    setLoanApprovalLetter(initialValues.loanApprovalLetter);
    setOfferType(initialValues.offerType);
    setConditions(initialValues.conditions);
    setCurrentConditionsValue("");
    setAppointment(initialValues.appointment);
    setSeller(initialValues.seller);
    setBuyer(initialValues.buyer);
    setErrors({});
  };
  const [currentConditionsValue, setCurrentConditionsValue] =
    React.useState("");
  const conditionsRef = React.createRef();
  const validations = {
    offerAmmount: [],
    propertyAddress: [],
    propertyId: [],
    email: [],
    phone: [],
    loanApprovalLetter: [],
    offerType: [],
    conditions: [],
    appointment: [],
    seller: [],
    buyer: [],
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
          offerAmmount,
          propertyAddress,
          propertyId,
          email,
          phone,
          loanApprovalLetter,
          offerType,
          conditions,
          appointment,
          seller,
          buyer,
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
            query: createOffer.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "OfferCreateForm")}
      {...rest}
    >
      <TextField
        label="Offer ammount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={offerAmmount}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              offerAmmount: value,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller,
              buyer,
            };
            const result = onChange(modelFields);
            value = result?.offerAmmount ?? value;
          }
          if (errors.offerAmmount?.hasError) {
            runValidationTasks("offerAmmount", value);
          }
          setOfferAmmount(value);
        }}
        onBlur={() => runValidationTasks("offerAmmount", offerAmmount)}
        errorMessage={errors.offerAmmount?.errorMessage}
        hasError={errors.offerAmmount?.hasError}
        {...getOverrideProps(overrides, "offerAmmount")}
      ></TextField>
      <TextField
        label="Property address"
        isRequired={false}
        isReadOnly={false}
        value={propertyAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress: value,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller,
              buyer,
            };
            const result = onChange(modelFields);
            value = result?.propertyAddress ?? value;
          }
          if (errors.propertyAddress?.hasError) {
            runValidationTasks("propertyAddress", value);
          }
          setPropertyAddress(value);
        }}
        onBlur={() => runValidationTasks("propertyAddress", propertyAddress)}
        errorMessage={errors.propertyAddress?.errorMessage}
        hasError={errors.propertyAddress?.hasError}
        {...getOverrideProps(overrides, "propertyAddress")}
      ></TextField>
      <TextField
        label="Property id"
        isRequired={false}
        isReadOnly={false}
        value={propertyId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId: value,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller,
              buyer,
            };
            const result = onChange(modelFields);
            value = result?.propertyId ?? value;
          }
          if (errors.propertyId?.hasError) {
            runValidationTasks("propertyId", value);
          }
          setPropertyId(value);
        }}
        onBlur={() => runValidationTasks("propertyId", propertyId)}
        errorMessage={errors.propertyId?.errorMessage}
        hasError={errors.propertyId?.hasError}
        {...getOverrideProps(overrides, "propertyId")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email: value,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller,
              buyer,
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
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone: value,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller,
              buyer,
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
        label="Loan approval letter"
        isRequired={false}
        isReadOnly={false}
        value={loanApprovalLetter}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter: value,
              offerType,
              conditions,
              appointment,
              seller,
              buyer,
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
      <SelectField
        label="Offer type"
        placeholder="Please select an option"
        isDisabled={false}
        value={offerType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType: value,
              conditions,
              appointment,
              seller,
              buyer,
            };
            const result = onChange(modelFields);
            value = result?.offerType ?? value;
          }
          if (errors.offerType?.hasError) {
            runValidationTasks("offerType", value);
          }
          setOfferType(value);
        }}
        onBlur={() => runValidationTasks("offerType", offerType)}
        errorMessage={errors.offerType?.errorMessage}
        hasError={errors.offerType?.hasError}
        {...getOverrideProps(overrides, "offerType")}
      >
        <option
          children="Cash"
          value="cash"
          {...getOverrideProps(overrides, "offerTypeoption0")}
        ></option>
        <option
          children="Financing"
          value="financing"
          {...getOverrideProps(overrides, "offerTypeoption1")}
        ></option>
        <option
          children="Sellerfinancing"
          value="sellerfinancing"
          {...getOverrideProps(overrides, "offerTypeoption2")}
        ></option>
        <option
          children="Lease to purchise"
          value="leaseToPurchise"
          {...getOverrideProps(overrides, "offerTypeoption3")}
        ></option>
      </SelectField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions: values,
              appointment,
              seller,
              buyer,
            };
            const result = onChange(modelFields);
            values = result?.conditions ?? values;
          }
          setConditions(values);
          setCurrentConditionsValue("");
        }}
        currentFieldValue={currentConditionsValue}
        label={"Conditions"}
        items={conditions}
        hasError={errors?.conditions?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("conditions", currentConditionsValue)
        }
        errorMessage={errors?.conditions?.errorMessage}
        setFieldValue={setCurrentConditionsValue}
        inputFieldRef={conditionsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Conditions"
          isRequired={false}
          isReadOnly={false}
          value={currentConditionsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.conditions?.hasError) {
              runValidationTasks("conditions", value);
            }
            setCurrentConditionsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("conditions", currentConditionsValue)
          }
          errorMessage={errors.conditions?.errorMessage}
          hasError={errors.conditions?.hasError}
          ref={conditionsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "conditions")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Appointment"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={appointment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment: value,
              seller,
              buyer,
            };
            const result = onChange(modelFields);
            value = result?.appointment ?? value;
          }
          if (errors.appointment?.hasError) {
            runValidationTasks("appointment", value);
          }
          setAppointment(value);
        }}
        onBlur={() => runValidationTasks("appointment", appointment)}
        errorMessage={errors.appointment?.errorMessage}
        hasError={errors.appointment?.hasError}
        {...getOverrideProps(overrides, "appointment")}
      ></TextField>
      <TextField
        label="Seller"
        isRequired={false}
        isReadOnly={false}
        value={seller}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller: value,
              buyer,
            };
            const result = onChange(modelFields);
            value = result?.seller ?? value;
          }
          if (errors.seller?.hasError) {
            runValidationTasks("seller", value);
          }
          setSeller(value);
        }}
        onBlur={() => runValidationTasks("seller", seller)}
        errorMessage={errors.seller?.errorMessage}
        hasError={errors.seller?.hasError}
        {...getOverrideProps(overrides, "seller")}
      ></TextField>
      <TextField
        label="Buyer"
        isRequired={false}
        isReadOnly={false}
        value={buyer}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              email,
              phone,
              loanApprovalLetter,
              offerType,
              conditions,
              appointment,
              seller,
              buyer: value,
            };
            const result = onChange(modelFields);
            value = result?.buyer ?? value;
          }
          if (errors.buyer?.hasError) {
            runValidationTasks("buyer", value);
          }
          setBuyer(value);
        }}
        onBlur={() => runValidationTasks("buyer", buyer)}
        errorMessage={errors.buyer?.errorMessage}
        hasError={errors.buyer?.hasError}
        {...getOverrideProps(overrides, "buyer")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
