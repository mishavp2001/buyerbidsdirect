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
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getProperty } from "./graphql/queries";
import { updateProperty } from "./graphql/mutations";
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
export default function PropertyUpdateForm(props) {
  const {
    id: idProp,
    property: propertyModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    address: "",
    position: "",
    price: "",
    arvprice: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    lotSize: "",
    yearBuilt: "",
    propertyType: "",
    listingStatus: "",
    listingOwner: "",
    ownerContact: "",
    description: "",
    photos: [],
    virtualTour: "",
    propertyTax: "",
    hoaFees: "",
    mlsNumber: "",
    zestimate: "",
    neighborhood: "",
    amenities: [],
  };
  const [address, setAddress] = React.useState(initialValues.address);
  const [position, setPosition] = React.useState(initialValues.position);
  const [price, setPrice] = React.useState(initialValues.price);
  const [arvprice, setArvprice] = React.useState(initialValues.arvprice);
  const [bedrooms, setBedrooms] = React.useState(initialValues.bedrooms);
  const [bathrooms, setBathrooms] = React.useState(initialValues.bathrooms);
  const [squareFootage, setSquareFootage] = React.useState(
    initialValues.squareFootage
  );
  const [lotSize, setLotSize] = React.useState(initialValues.lotSize);
  const [yearBuilt, setYearBuilt] = React.useState(initialValues.yearBuilt);
  const [propertyType, setPropertyType] = React.useState(
    initialValues.propertyType
  );
  const [listingStatus, setListingStatus] = React.useState(
    initialValues.listingStatus
  );
  const [listingOwner, setListingOwner] = React.useState(
    initialValues.listingOwner
  );
  const [ownerContact, setOwnerContact] = React.useState(
    initialValues.ownerContact
  );
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [photos, setPhotos] = React.useState(initialValues.photos);
  const [virtualTour, setVirtualTour] = React.useState(
    initialValues.virtualTour
  );
  const [propertyTax, setPropertyTax] = React.useState(
    initialValues.propertyTax
  );
  const [hoaFees, setHoaFees] = React.useState(initialValues.hoaFees);
  const [mlsNumber, setMlsNumber] = React.useState(initialValues.mlsNumber);
  const [zestimate, setZestimate] = React.useState(initialValues.zestimate);
  const [neighborhood, setNeighborhood] = React.useState(
    initialValues.neighborhood
  );
  const [amenities, setAmenities] = React.useState(initialValues.amenities);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = propertyRecord
      ? { ...initialValues, ...propertyRecord }
      : initialValues;
    setAddress(cleanValues.address);
    setPosition(
      typeof cleanValues.position === "string" || cleanValues.position === null
        ? cleanValues.position
        : JSON.stringify(cleanValues.position)
    );
    setPrice(cleanValues.price);
    setArvprice(cleanValues.arvprice);
    setBedrooms(cleanValues.bedrooms);
    setBathrooms(cleanValues.bathrooms);
    setSquareFootage(cleanValues.squareFootage);
    setLotSize(cleanValues.lotSize);
    setYearBuilt(cleanValues.yearBuilt);
    setPropertyType(cleanValues.propertyType);
    setListingStatus(cleanValues.listingStatus);
    setListingOwner(cleanValues.listingOwner);
    setOwnerContact(cleanValues.ownerContact);
    setDescription(cleanValues.description);
    setPhotos(cleanValues.photos ?? []);
    setCurrentPhotosValue("");
    setVirtualTour(cleanValues.virtualTour);
    setPropertyTax(cleanValues.propertyTax);
    setHoaFees(cleanValues.hoaFees);
    setMlsNumber(cleanValues.mlsNumber);
    setZestimate(cleanValues.zestimate);
    setNeighborhood(cleanValues.neighborhood);
    setAmenities(cleanValues.amenities ?? []);
    setCurrentAmenitiesValue("");
    setErrors({});
  };
  const [propertyRecord, setPropertyRecord] = React.useState(propertyModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getProperty.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getProperty
        : propertyModelProp;
      setPropertyRecord(record);
    };
    queryData();
  }, [idProp, propertyModelProp]);
  React.useEffect(resetStateValues, [propertyRecord]);
  const [currentPhotosValue, setCurrentPhotosValue] = React.useState("");
  const photosRef = React.createRef();
  const [currentAmenitiesValue, setCurrentAmenitiesValue] = React.useState("");
  const amenitiesRef = React.createRef();
  const validations = {
    address: [{ type: "Required" }],
    position: [{ type: "Required" }, { type: "JSON" }],
    price: [{ type: "Required" }],
    arvprice: [{ type: "Required" }],
    bedrooms: [{ type: "Required" }],
    bathrooms: [{ type: "Required" }],
    squareFootage: [{ type: "Required" }],
    lotSize: [{ type: "Required" }],
    yearBuilt: [{ type: "Required" }],
    propertyType: [{ type: "Required" }],
    listingStatus: [{ type: "Required" }],
    listingOwner: [{ type: "Required" }],
    ownerContact: [{ type: "Required" }],
    description: [{ type: "Required" }],
    photos: [],
    virtualTour: [],
    propertyTax: [],
    hoaFees: [],
    mlsNumber: [],
    zestimate: [],
    neighborhood: [],
    amenities: [],
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
          address,
          position,
          price,
          arvprice,
          bedrooms,
          bathrooms,
          squareFootage,
          lotSize,
          yearBuilt,
          propertyType,
          listingStatus,
          listingOwner,
          ownerContact,
          description,
          photos: photos ?? null,
          virtualTour: virtualTour ?? null,
          propertyTax: propertyTax ?? null,
          hoaFees: hoaFees ?? null,
          mlsNumber: mlsNumber ?? null,
          zestimate: zestimate ?? null,
          neighborhood: neighborhood ?? null,
          amenities: amenities ?? null,
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
            query: updateProperty.replaceAll("__typename", ""),
            variables: {
              input: {
                id: propertyRecord.id,
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
      {...getOverrideProps(overrides, "PropertyUpdateForm")}
      {...rest}
    >
      <TextField
        label="Address"
        isRequired={true}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address: value,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextAreaField
        label="Position"
        isRequired={true}
        isReadOnly={false}
        value={position}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position: value,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.position ?? value;
          }
          if (errors.position?.hasError) {
            runValidationTasks("position", value);
          }
          setPosition(value);
        }}
        onBlur={() => runValidationTasks("position", position)}
        errorMessage={errors.position?.errorMessage}
        hasError={errors.position?.hasError}
        {...getOverrideProps(overrides, "position")}
      ></TextAreaField>
      <TextField
        label="Price"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={price}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price: value,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.price ?? value;
          }
          if (errors.price?.hasError) {
            runValidationTasks("price", value);
          }
          setPrice(value);
        }}
        onBlur={() => runValidationTasks("price", price)}
        errorMessage={errors.price?.errorMessage}
        hasError={errors.price?.hasError}
        {...getOverrideProps(overrides, "price")}
      ></TextField>
      <TextField
        label="Arvprice"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={arvprice}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice: value,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.arvprice ?? value;
          }
          if (errors.arvprice?.hasError) {
            runValidationTasks("arvprice", value);
          }
          setArvprice(value);
        }}
        onBlur={() => runValidationTasks("arvprice", arvprice)}
        errorMessage={errors.arvprice?.errorMessage}
        hasError={errors.arvprice?.hasError}
        {...getOverrideProps(overrides, "arvprice")}
      ></TextField>
      <TextField
        label="Bedrooms"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={bedrooms}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms: value,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.bedrooms ?? value;
          }
          if (errors.bedrooms?.hasError) {
            runValidationTasks("bedrooms", value);
          }
          setBedrooms(value);
        }}
        onBlur={() => runValidationTasks("bedrooms", bedrooms)}
        errorMessage={errors.bedrooms?.errorMessage}
        hasError={errors.bedrooms?.hasError}
        {...getOverrideProps(overrides, "bedrooms")}
      ></TextField>
      <TextField
        label="Bathrooms"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={bathrooms}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms: value,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.bathrooms ?? value;
          }
          if (errors.bathrooms?.hasError) {
            runValidationTasks("bathrooms", value);
          }
          setBathrooms(value);
        }}
        onBlur={() => runValidationTasks("bathrooms", bathrooms)}
        errorMessage={errors.bathrooms?.errorMessage}
        hasError={errors.bathrooms?.hasError}
        {...getOverrideProps(overrides, "bathrooms")}
      ></TextField>
      <TextField
        label="Square footage"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={squareFootage}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage: value,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.squareFootage ?? value;
          }
          if (errors.squareFootage?.hasError) {
            runValidationTasks("squareFootage", value);
          }
          setSquareFootage(value);
        }}
        onBlur={() => runValidationTasks("squareFootage", squareFootage)}
        errorMessage={errors.squareFootage?.errorMessage}
        hasError={errors.squareFootage?.hasError}
        {...getOverrideProps(overrides, "squareFootage")}
      ></TextField>
      <TextField
        label="Lot size"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={lotSize}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize: value,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.lotSize ?? value;
          }
          if (errors.lotSize?.hasError) {
            runValidationTasks("lotSize", value);
          }
          setLotSize(value);
        }}
        onBlur={() => runValidationTasks("lotSize", lotSize)}
        errorMessage={errors.lotSize?.errorMessage}
        hasError={errors.lotSize?.hasError}
        {...getOverrideProps(overrides, "lotSize")}
      ></TextField>
      <TextField
        label="Year built"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={yearBuilt}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt: value,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.yearBuilt ?? value;
          }
          if (errors.yearBuilt?.hasError) {
            runValidationTasks("yearBuilt", value);
          }
          setYearBuilt(value);
        }}
        onBlur={() => runValidationTasks("yearBuilt", yearBuilt)}
        errorMessage={errors.yearBuilt?.errorMessage}
        hasError={errors.yearBuilt?.hasError}
        {...getOverrideProps(overrides, "yearBuilt")}
      ></TextField>
      <TextField
        label="Property type"
        isRequired={true}
        isReadOnly={false}
        value={propertyType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType: value,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.propertyType ?? value;
          }
          if (errors.propertyType?.hasError) {
            runValidationTasks("propertyType", value);
          }
          setPropertyType(value);
        }}
        onBlur={() => runValidationTasks("propertyType", propertyType)}
        errorMessage={errors.propertyType?.errorMessage}
        hasError={errors.propertyType?.hasError}
        {...getOverrideProps(overrides, "propertyType")}
      ></TextField>
      <TextField
        label="Listing status"
        isRequired={true}
        isReadOnly={false}
        value={listingStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus: value,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.listingStatus ?? value;
          }
          if (errors.listingStatus?.hasError) {
            runValidationTasks("listingStatus", value);
          }
          setListingStatus(value);
        }}
        onBlur={() => runValidationTasks("listingStatus", listingStatus)}
        errorMessage={errors.listingStatus?.errorMessage}
        hasError={errors.listingStatus?.hasError}
        {...getOverrideProps(overrides, "listingStatus")}
      ></TextField>
      <TextField
        label="Listing owner"
        isRequired={true}
        isReadOnly={false}
        value={listingOwner}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner: value,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.listingOwner ?? value;
          }
          if (errors.listingOwner?.hasError) {
            runValidationTasks("listingOwner", value);
          }
          setListingOwner(value);
        }}
        onBlur={() => runValidationTasks("listingOwner", listingOwner)}
        errorMessage={errors.listingOwner?.errorMessage}
        hasError={errors.listingOwner?.hasError}
        {...getOverrideProps(overrides, "listingOwner")}
      ></TextField>
      <TextField
        label="Owner contact"
        isRequired={true}
        isReadOnly={false}
        value={ownerContact}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact: value,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.ownerContact ?? value;
          }
          if (errors.ownerContact?.hasError) {
            runValidationTasks("ownerContact", value);
          }
          setOwnerContact(value);
        }}
        onBlur={() => runValidationTasks("ownerContact", ownerContact)}
        errorMessage={errors.ownerContact?.errorMessage}
        hasError={errors.ownerContact?.hasError}
        {...getOverrideProps(overrides, "ownerContact")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={true}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description: value,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos: values,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            values = result?.photos ?? values;
          }
          setPhotos(values);
          setCurrentPhotosValue("");
        }}
        currentFieldValue={currentPhotosValue}
        label={"Photos"}
        items={photos}
        hasError={errors?.photos?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("photos", currentPhotosValue)
        }
        errorMessage={errors?.photos?.errorMessage}
        setFieldValue={setCurrentPhotosValue}
        inputFieldRef={photosRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Photos"
          isRequired={false}
          isReadOnly={false}
          value={currentPhotosValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.photos?.hasError) {
              runValidationTasks("photos", value);
            }
            setCurrentPhotosValue(value);
          }}
          onBlur={() => runValidationTasks("photos", currentPhotosValue)}
          errorMessage={errors.photos?.errorMessage}
          hasError={errors.photos?.hasError}
          ref={photosRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "photos")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Virtual tour"
        isRequired={false}
        isReadOnly={false}
        value={virtualTour}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour: value,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.virtualTour ?? value;
          }
          if (errors.virtualTour?.hasError) {
            runValidationTasks("virtualTour", value);
          }
          setVirtualTour(value);
        }}
        onBlur={() => runValidationTasks("virtualTour", virtualTour)}
        errorMessage={errors.virtualTour?.errorMessage}
        hasError={errors.virtualTour?.hasError}
        {...getOverrideProps(overrides, "virtualTour")}
      ></TextField>
      <TextField
        label="Property tax"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={propertyTax}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax: value,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.propertyTax ?? value;
          }
          if (errors.propertyTax?.hasError) {
            runValidationTasks("propertyTax", value);
          }
          setPropertyTax(value);
        }}
        onBlur={() => runValidationTasks("propertyTax", propertyTax)}
        errorMessage={errors.propertyTax?.errorMessage}
        hasError={errors.propertyTax?.hasError}
        {...getOverrideProps(overrides, "propertyTax")}
      ></TextField>
      <TextField
        label="Hoa fees"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={hoaFees}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees: value,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.hoaFees ?? value;
          }
          if (errors.hoaFees?.hasError) {
            runValidationTasks("hoaFees", value);
          }
          setHoaFees(value);
        }}
        onBlur={() => runValidationTasks("hoaFees", hoaFees)}
        errorMessage={errors.hoaFees?.errorMessage}
        hasError={errors.hoaFees?.hasError}
        {...getOverrideProps(overrides, "hoaFees")}
      ></TextField>
      <TextField
        label="Mls number"
        isRequired={false}
        isReadOnly={false}
        value={mlsNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber: value,
              zestimate,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.mlsNumber ?? value;
          }
          if (errors.mlsNumber?.hasError) {
            runValidationTasks("mlsNumber", value);
          }
          setMlsNumber(value);
        }}
        onBlur={() => runValidationTasks("mlsNumber", mlsNumber)}
        errorMessage={errors.mlsNumber?.errorMessage}
        hasError={errors.mlsNumber?.hasError}
        {...getOverrideProps(overrides, "mlsNumber")}
      ></TextField>
      <TextField
        label="Zestimate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={zestimate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate: value,
              neighborhood,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.zestimate ?? value;
          }
          if (errors.zestimate?.hasError) {
            runValidationTasks("zestimate", value);
          }
          setZestimate(value);
        }}
        onBlur={() => runValidationTasks("zestimate", zestimate)}
        errorMessage={errors.zestimate?.errorMessage}
        hasError={errors.zestimate?.hasError}
        {...getOverrideProps(overrides, "zestimate")}
      ></TextField>
      <TextField
        label="Neighborhood"
        isRequired={false}
        isReadOnly={false}
        value={neighborhood}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood: value,
              amenities,
            };
            const result = onChange(modelFields);
            value = result?.neighborhood ?? value;
          }
          if (errors.neighborhood?.hasError) {
            runValidationTasks("neighborhood", value);
          }
          setNeighborhood(value);
        }}
        onBlur={() => runValidationTasks("neighborhood", neighborhood)}
        errorMessage={errors.neighborhood?.errorMessage}
        hasError={errors.neighborhood?.hasError}
        {...getOverrideProps(overrides, "neighborhood")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              address,
              position,
              price,
              arvprice,
              bedrooms,
              bathrooms,
              squareFootage,
              lotSize,
              yearBuilt,
              propertyType,
              listingStatus,
              listingOwner,
              ownerContact,
              description,
              photos,
              virtualTour,
              propertyTax,
              hoaFees,
              mlsNumber,
              zestimate,
              neighborhood,
              amenities: values,
            };
            const result = onChange(modelFields);
            values = result?.amenities ?? values;
          }
          setAmenities(values);
          setCurrentAmenitiesValue("");
        }}
        currentFieldValue={currentAmenitiesValue}
        label={"Amenities"}
        items={amenities}
        hasError={errors?.amenities?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("amenities", currentAmenitiesValue)
        }
        errorMessage={errors?.amenities?.errorMessage}
        setFieldValue={setCurrentAmenitiesValue}
        inputFieldRef={amenitiesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Amenities"
          isRequired={false}
          isReadOnly={false}
          value={currentAmenitiesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.amenities?.hasError) {
              runValidationTasks("amenities", value);
            }
            setCurrentAmenitiesValue(value);
          }}
          onBlur={() => runValidationTasks("amenities", currentAmenitiesValue)}
          errorMessage={errors.amenities?.errorMessage}
          hasError={errors.amenities?.hasError}
          ref={amenitiesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "amenities")}
        ></TextField>
      </ArrayField>
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
          isDisabled={!(idProp || propertyModelProp)}
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
              !(idProp || propertyModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
