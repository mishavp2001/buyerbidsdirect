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
import { useNavigate } from 'react-router-dom';
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getOffer } from "./graphql/queries";
import { updateOffer, deleteOffer } from "./graphql/mutations";
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
export default function OfferUpdateForm(props) {
  const {
    id: idProp,
    offer: offerModelProp,
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
    propertyId: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    ownerEmail: "",
    ownerName: "",
    loanApprovalLetter: "",
    offerType: "",
    conditions: [],
    appointment: "",
    seller: "",
    buyer: "",
  };
  const navigate = useNavigate();

  const [offerAmmount, setOfferAmmount] = React.useState(
    initialValues.offerAmmount
  );
  const [propertyAddress, setPropertyAddress] = React.useState(
    initialValues.propertyAddress
  );
  const [propertyId, setPropertyId] = React.useState(initialValues.propertyId);
  const [buyerName, setBuyerName] = React.useState(initialValues.buyerName);
  const [buyerEmail, setBuyerEmail] = React.useState(initialValues.buyerEmail);
  const [buyerPhone, setBuyerPhone] = React.useState(initialValues.buyerPhone);
  const [ownerEmail, setOwnerEmail] = React.useState(initialValues.ownerEmail);
  const [ownerName, setOwnerName] = React.useState(initialValues.ownerName);
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
    const cleanValues = offerRecord
      ? { ...initialValues, ...offerRecord }
      : initialValues;
    setOfferAmmount(cleanValues.offerAmmount);
    setPropertyAddress(cleanValues.propertyAddress);
    setPropertyId(cleanValues.propertyId);
    setBuyerName(cleanValues.buyerName);
    setBuyerEmail(cleanValues.buyerEmail);
    setBuyerPhone(cleanValues.buyerPhone);
    setOwnerEmail(cleanValues.ownerEmail);
    setOwnerName(cleanValues.ownerName);
    setLoanApprovalLetter(cleanValues.loanApprovalLetter);
    setOfferType(cleanValues.offerType);
    setConditions(cleanValues.conditions ?? []);
    setCurrentConditionsValue("");
    setAppointment(cleanValues.appointment);
    setSeller(cleanValues.seller);
    setBuyer(cleanValues.buyer);
    setErrors({});
  };
  const deleteOfferHandler = async () => {
    try {
      await client.graphql({
        query: deleteOffer.replaceAll("__typename", ""),
        variables: {
          input: {
            id: offerRecord.id
          },
        },
      });
      if (onSuccess) {
        navigate("/offers");
      }
    } catch (err) {
      if (onError) {
        const messages = err.errors.map((e) => e.message).join("\n");
        onError(modelFields, messages);
      }
    }
  };
  const [offerRecord, setOfferRecord] = React.useState(offerModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
          await client.graphql({
            query: getOffer.replaceAll("__typename", ""),
            variables: { id: idProp },
          })
        )?.data?.getOffer
        : offerModelProp;
      setOfferRecord(record);
    };
    queryData();
  }, [idProp, offerModelProp]);
  React.useEffect(resetStateValues, [offerRecord]);
  const [currentConditionsValue, setCurrentConditionsValue] =
    React.useState("");
  const conditionsRef = React.createRef();
  const validations = {
    offerAmmount: [],
    propertyAddress: [],
    propertyId: [],
    buyerName: [],
    buyerEmail: [],
    buyerPhone: [],
    ownerEmail: [],
    ownerName: [],
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
      templateColumns="repeat(2, 1fr)"  // Two columns layout
      gap="10px"  // Reduce space between fields
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          offerAmmount: offerAmmount ?? null,
          propertyAddress: propertyAddress ?? null,
          propertyId: propertyId ?? null,
          buyerName: buyerName ?? null,
          buyerEmail: buyerEmail ?? null,
          buyerPhone: buyerPhone ?? null,
          ownerEmail: ownerEmail ?? null,
          ownerName: ownerName ?? null,
          loanApprovalLetter: loanApprovalLetter ?? null,
          offerType: offerType ?? null,
          conditions: conditions ?? null,
          appointment: appointment ?? null,
          seller: seller ?? null,
          buyer: buyer ?? null,
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
            query: updateOffer.replaceAll("__typename", ""),
            variables: {
              input: {
                id: offerRecord.id,
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
      {...getOverrideProps(overrides, "OfferUpdateForm")}
      {...rest}
    >
      <div className="merge-col-field">
        <TextField
          label="Address"
          isRequired={false}
          isReadOnly={true}
          disabled
          value={propertyAddress}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress: value,
                propertyId,
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName,
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
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName,
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
      </div>
      <div className="merge-col-field">
        <TextField
          label="Buyer name"
          isRequired={false}
          isReadOnly={false}
          value={buyerName}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId,
                buyerName: value,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName,
                loanApprovalLetter,
                offerType,
                conditions,
                appointment,
                seller,
                buyer,
              };
              const result = onChange(modelFields);
              value = result?.buyerName ?? value;
            }
            if (errors.buyerName?.hasError) {
              runValidationTasks("buyerName", value);
            }
            setBuyerName(value);
          }}
          onBlur={() => runValidationTasks("buyerName", buyerName)}
          errorMessage={errors.buyerName?.errorMessage}
          hasError={errors.buyerName?.hasError}
          {...getOverrideProps(overrides, "buyerName")}
        ></TextField>
        <TextField
          label="Buyer email"
          isRequired={false}
          isReadOnly={false}
          value={buyerEmail}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId,
                buyerName,
                buyerEmail: value,
                buyerPhone,
                ownerEmail,
                ownerName,
                loanApprovalLetter,
                offerType,
                conditions,
                appointment,
                seller,
                buyer,
              };
              const result = onChange(modelFields);
              value = result?.buyerEmail ?? value;
            }
            if (errors.buyerEmail?.hasError) {
              runValidationTasks("buyerEmail", value);
            }
            setBuyerEmail(value);
          }}
          onBlur={() => runValidationTasks("buyerEmail", buyerEmail)}
          errorMessage={errors.buyerEmail?.errorMessage}
          hasError={errors.buyerEmail?.hasError}
          {...getOverrideProps(overrides, "buyerEmail")}
        ></TextField>
        <TextField
          label="Buyer phone"
          isRequired={false}
          isReadOnly={false}
          value={buyerPhone}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId,
                buyerName,
                buyerEmail,
                buyerPhone: value,
                ownerEmail,
                ownerName,
                loanApprovalLetter,
                offerType,
                conditions,
                appointment,
                seller,
                buyer,
              };
              const result = onChange(modelFields);
              value = result?.buyerPhone ?? value;
            }
            if (errors.buyerPhone?.hasError) {
              runValidationTasks("buyerPhone", value);
            }
            setBuyerPhone(value);
          }}
          onBlur={() => runValidationTasks("buyerPhone", buyerPhone)}
          errorMessage={errors.buyerPhone?.errorMessage}
          hasError={errors.buyerPhone?.hasError}
          {...getOverrideProps(overrides, "buyerPhone")}
        ></TextField>
      </div>

      <div className="merge-col-field">
        <TextField
          label="Owner email"
          isRequired={false}
          isReadOnly={false}
          value={ownerEmail}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId,
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail: value,
                ownerName,
                loanApprovalLetter,
                offerType,
                conditions,
                appointment,
                seller,
                buyer,
              };
              const result = onChange(modelFields);
              value = result?.ownerEmail ?? value;
            }
            if (errors.ownerEmail?.hasError) {
              runValidationTasks("ownerEmail", value);
            }
            setOwnerEmail(value);
          }}
          onBlur={() => runValidationTasks("ownerEmail", ownerEmail)}
          errorMessage={errors.ownerEmail?.errorMessage}
          hasError={errors.ownerEmail?.hasError}
          {...getOverrideProps(overrides, "ownerEmail")}
        ></TextField>
        <TextField
          label="Owner name"
          isRequired={false}
          isReadOnly={false}
          value={ownerName}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId,
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName: value,
                loanApprovalLetter,
                offerType,
                conditions,
                appointment,
                seller,
                buyer,
              };
              const result = onChange(modelFields);
              value = result?.ownerName ?? value;
            }
            if (errors.ownerName?.hasError) {
              runValidationTasks("ownerName", value);
            }
            setOwnerName(value);
          }}
          onBlur={() => runValidationTasks("ownerName", ownerName)}
          errorMessage={errors.ownerName?.errorMessage}
          hasError={errors.ownerName?.hasError}
          {...getOverrideProps(overrides, "ownerName")}
        ></TextField>
      </div>
      <div className="merge-col-field">
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
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName,
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
        <TextField
          label="Property id"
          labelHidden
          style={{ 'display': 'none' }}
          isRequired={false}
          isReadOnly={true}
          value={propertyId}
          onChange={(e) => {
            let { value } = e.target;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId: value,
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName,
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
      </div>




      <div className="merge-col-field">
        <ArrayField
          onChange={async (items) => {
            let values = items;
            if (onChange) {
              const modelFields = {
                offerAmmount,
                propertyAddress,
                propertyId,
                buyerName,
                buyerEmail,
                buyerPhone,
                ownerEmail,
                ownerName,
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
      </div>
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
              buyerName,
              buyerEmail,
              buyerPhone,
              ownerEmail,
              ownerName,
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
        labelHidden
        style={{ display: 'none' }}
        isRequired={false}
        isReadOnly={true}
        value={seller}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              buyerName,
              buyerEmail,
              buyerPhone,
              ownerEmail,
              ownerName,
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
        labelHidden
        style={{ display: 'none' }}
        isRequired={false}
        isReadOnly={true}
        value={buyer}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              offerAmmount,
              propertyAddress,
              propertyId,
              buyerName,
              buyerEmail,
              buyerPhone,
              ownerEmail,
              ownerName,
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

      <div className="merge-col-field">
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
            isDisabled={!(idProp || offerModelProp)}
            {...getOverrideProps(overrides, "ResetButton")}
          ></Button>
          <Flex
            gap="15px"
            {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
          >
             <Button
            variation="primary"
            children="Delete"
            onClick={(event) => {
              event.preventDefault();
              deleteOfferHandler();
            }}
          ></Button>
            <Button
              children="Submit"
              type="submit"
              variation="primary"
              isDisabled={
                !(idProp || offerModelProp) ||
                Object.values(errors).some((e) => e?.hasError)
              }
              {...getOverrideProps(overrides, "SubmitButton")}
            ></Button>
          </Flex>
        </Flex>
      </div>
    </Grid>
  );
}
