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
    id: "",
    name: "",
    user_role: "",
    family_name: "",
    given_name: "",
    middle_name: "",
    nickname: "",
    preferred_username: "",
    profile: "",
    picture: "",
    website: "",
    gender: "",
    birthdate: "",
    zoneinfo: "",
    locale: "",
    address: "",
    email: "",
    phone_number: "",
  };
  const [id, setId] = React.useState(initialValues.id);
  const [name, setName] = React.useState(initialValues.name);
  const [user_role, setUser_role] = React.useState(initialValues.user_role);
  const [family_name, setFamily_name] = React.useState(
    initialValues.family_name
  );
  const [given_name, setGiven_name] = React.useState(initialValues.given_name);
  const [middle_name, setMiddle_name] = React.useState(
    initialValues.middle_name
  );
  const [nickname, setNickname] = React.useState(initialValues.nickname);
  const [preferred_username, setPreferred_username] = React.useState(
    initialValues.preferred_username
  );
  const [profile, setProfile] = React.useState(initialValues.profile);
  const [picture, setPicture] = React.useState(initialValues.picture);
  const [website, setWebsite] = React.useState(initialValues.website);
  const [gender, setGender] = React.useState(initialValues.gender);
  const [birthdate, setBirthdate] = React.useState(initialValues.birthdate);
  const [zoneinfo, setZoneinfo] = React.useState(initialValues.zoneinfo);
  const [locale, setLocale] = React.useState(initialValues.locale);
  const [address, setAddress] = React.useState(initialValues.address);
  const [email, setEmail] = React.useState(initialValues.email);
  const [phone_number, setPhone_number] = React.useState(
    initialValues.phone_number
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userProfileRecord
      ? { ...initialValues, ...userProfileRecord }
      : initialValues;
    setId(cleanValues.id);
    setName(cleanValues.name);
    setUser_role(cleanValues.user_role);
    setFamily_name(cleanValues.family_name);
    setGiven_name(cleanValues.given_name);
    setMiddle_name(cleanValues.middle_name);
    setNickname(cleanValues.nickname);
    setPreferred_username(cleanValues.preferred_username);
    setProfile(cleanValues.profile);
    setPicture(cleanValues.picture);
    setWebsite(cleanValues.website);
    setGender(cleanValues.gender);
    setBirthdate(cleanValues.birthdate);
    setZoneinfo(cleanValues.zoneinfo);
    setLocale(cleanValues.locale);
    setAddress(cleanValues.address);
    setEmail(cleanValues.email);
    setPhone_number(cleanValues.phone_number);
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
    id: [{ type: "Required" }],
    name: [],
    user_role: [],
    family_name: [],
    given_name: [],
    middle_name: [],
    nickname: [],
    preferred_username: [],
    profile: [],
    picture: [{ type: "URL" }],
    website: [{ type: "URL" }],
    gender: [],
    birthdate: [],
    zoneinfo: [],
    locale: [],
    address: [],
    email: [{ type: "Required" }, { type: "Email" }],
    phone_number: [{ type: "Required" }],
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
          id,
          name: name ?? null,
          user_role: user_role ?? null,
          family_name: family_name ?? null,
          given_name: given_name ?? null,
          middle_name: middle_name ?? null,
          nickname: nickname ?? null,
          preferred_username: preferred_username ?? null,
          profile: profile ?? null,
          picture: picture ?? null,
          website: website ?? null,
          gender: gender ?? null,
          birthdate: birthdate ?? null,
          zoneinfo: zoneinfo ?? null,
          locale: locale ?? null,
          address: address ?? null,
          email,
          phone_number,
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
        label="Id"
        isRequired={true}
        isReadOnly={true}
        value={id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id: value,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.id ?? value;
          }
          if (errors.id?.hasError) {
            runValidationTasks("id", value);
          }
          setId(value);
        }}
        onBlur={() => runValidationTasks("id", id)}
        errorMessage={errors.id?.errorMessage}
        hasError={errors.id?.hasError}
        {...getOverrideProps(overrides, "id")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name: value,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <SelectField
        label="User role"
        placeholder="Please select an option"
        isDisabled={false}
        value={user_role}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role: value,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.user_role ?? value;
          }
          if (errors.user_role?.hasError) {
            runValidationTasks("user_role", value);
          }
          setUser_role(value);
        }}
        onBlur={() => runValidationTasks("user_role", user_role)}
        errorMessage={errors.user_role?.errorMessage}
        hasError={errors.user_role?.hasError}
        {...getOverrideProps(overrides, "user_role")}
      >
        <option
          children="Owner"
          value="owner"
          {...getOverrideProps(overrides, "user_roleoption0")}
        ></option>
        <option
          children="Investor"
          value="investor"
          {...getOverrideProps(overrides, "user_roleoption1")}
        ></option>
        <option
          children="Lander"
          value="lander"
          {...getOverrideProps(overrides, "user_roleoption2")}
        ></option>
        <option
          children="Wholesaler"
          value="wholesaler"
          {...getOverrideProps(overrides, "user_roleoption3")}
        ></option>
        <option
          children="Realtor"
          value="realtor"
          {...getOverrideProps(overrides, "user_roleoption4")}
        ></option>
      </SelectField>
      <TextField
        label="Family name"
        isRequired={false}
        isReadOnly={false}
        value={family_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name: value,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.family_name ?? value;
          }
          if (errors.family_name?.hasError) {
            runValidationTasks("family_name", value);
          }
          setFamily_name(value);
        }}
        onBlur={() => runValidationTasks("family_name", family_name)}
        errorMessage={errors.family_name?.errorMessage}
        hasError={errors.family_name?.hasError}
        {...getOverrideProps(overrides, "family_name")}
      ></TextField>
      <TextField
        label="Given name"
        isRequired={false}
        isReadOnly={false}
        value={given_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name: value,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.given_name ?? value;
          }
          if (errors.given_name?.hasError) {
            runValidationTasks("given_name", value);
          }
          setGiven_name(value);
        }}
        onBlur={() => runValidationTasks("given_name", given_name)}
        errorMessage={errors.given_name?.errorMessage}
        hasError={errors.given_name?.hasError}
        {...getOverrideProps(overrides, "given_name")}
      ></TextField>
      <TextField
        label="Middle name"
        isRequired={false}
        isReadOnly={false}
        value={middle_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name: value,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.middle_name ?? value;
          }
          if (errors.middle_name?.hasError) {
            runValidationTasks("middle_name", value);
          }
          setMiddle_name(value);
        }}
        onBlur={() => runValidationTasks("middle_name", middle_name)}
        errorMessage={errors.middle_name?.errorMessage}
        hasError={errors.middle_name?.hasError}
        {...getOverrideProps(overrides, "middle_name")}
      ></TextField>
      <TextField
        label="Nickname"
        isRequired={false}
        isReadOnly={false}
        value={nickname}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname: value,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.nickname ?? value;
          }
          if (errors.nickname?.hasError) {
            runValidationTasks("nickname", value);
          }
          setNickname(value);
        }}
        onBlur={() => runValidationTasks("nickname", nickname)}
        errorMessage={errors.nickname?.errorMessage}
        hasError={errors.nickname?.hasError}
        {...getOverrideProps(overrides, "nickname")}
      ></TextField>
      <TextField
        label="Preferred username"
        isRequired={false}
        isReadOnly={false}
        value={preferred_username}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username: value,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.preferred_username ?? value;
          }
          if (errors.preferred_username?.hasError) {
            runValidationTasks("preferred_username", value);
          }
          setPreferred_username(value);
        }}
        onBlur={() =>
          runValidationTasks("preferred_username", preferred_username)
        }
        errorMessage={errors.preferred_username?.errorMessage}
        hasError={errors.preferred_username?.hasError}
        {...getOverrideProps(overrides, "preferred_username")}
      ></TextField>
      <TextField
        label="Profile"
        isRequired={false}
        isReadOnly={false}
        value={profile}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile: value,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.profile ?? value;
          }
          if (errors.profile?.hasError) {
            runValidationTasks("profile", value);
          }
          setProfile(value);
        }}
        onBlur={() => runValidationTasks("profile", profile)}
        errorMessage={errors.profile?.errorMessage}
        hasError={errors.profile?.hasError}
        {...getOverrideProps(overrides, "profile")}
      ></TextField>
      <TextField
        label="Picture"
        isRequired={false}
        isReadOnly={false}
        value={picture}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture: value,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.picture ?? value;
          }
          if (errors.picture?.hasError) {
            runValidationTasks("picture", value);
          }
          setPicture(value);
        }}
        onBlur={() => runValidationTasks("picture", picture)}
        errorMessage={errors.picture?.errorMessage}
        hasError={errors.picture?.hasError}
        {...getOverrideProps(overrides, "picture")}
      ></TextField>
      <TextField
        label="Website"
        isRequired={false}
        isReadOnly={false}
        value={website}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website: value,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.website ?? value;
          }
          if (errors.website?.hasError) {
            runValidationTasks("website", value);
          }
          setWebsite(value);
        }}
        onBlur={() => runValidationTasks("website", website)}
        errorMessage={errors.website?.errorMessage}
        hasError={errors.website?.hasError}
        {...getOverrideProps(overrides, "website")}
      ></TextField>
      <TextField
        label="Gender"
        isRequired={false}
        isReadOnly={false}
        value={gender}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender: value,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.gender ?? value;
          }
          if (errors.gender?.hasError) {
            runValidationTasks("gender", value);
          }
          setGender(value);
        }}
        onBlur={() => runValidationTasks("gender", gender)}
        errorMessage={errors.gender?.errorMessage}
        hasError={errors.gender?.hasError}
        {...getOverrideProps(overrides, "gender")}
      ></TextField>
      <TextField
        label="Birthdate"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={birthdate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate: value,
              zoneinfo,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.birthdate ?? value;
          }
          if (errors.birthdate?.hasError) {
            runValidationTasks("birthdate", value);
          }
          setBirthdate(value);
        }}
        onBlur={() => runValidationTasks("birthdate", birthdate)}
        errorMessage={errors.birthdate?.errorMessage}
        hasError={errors.birthdate?.hasError}
        {...getOverrideProps(overrides, "birthdate")}
      ></TextField>
      <TextField
        label="Zoneinfo"
        isRequired={false}
        isReadOnly={false}
        value={zoneinfo}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo: value,
              locale,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.zoneinfo ?? value;
          }
          if (errors.zoneinfo?.hasError) {
            runValidationTasks("zoneinfo", value);
          }
          setZoneinfo(value);
        }}
        onBlur={() => runValidationTasks("zoneinfo", zoneinfo)}
        errorMessage={errors.zoneinfo?.errorMessage}
        hasError={errors.zoneinfo?.hasError}
        {...getOverrideProps(overrides, "zoneinfo")}
      ></TextField>
      <TextField
        label="Locale"
        isRequired={false}
        isReadOnly={false}
        value={locale}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale: value,
              address,
              email,
              phone_number,
            };
            const result = onChange(modelFields);
            value = result?.locale ?? value;
          }
          if (errors.locale?.hasError) {
            runValidationTasks("locale", value);
          }
          setLocale(value);
        }}
        onBlur={() => runValidationTasks("locale", locale)}
        errorMessage={errors.locale?.errorMessage}
        hasError={errors.locale?.hasError}
        {...getOverrideProps(overrides, "locale")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address: value,
              email,
              phone_number,
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
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email: value,
              phone_number,
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
        label="Phone number"
        isRequired={true}
        isReadOnly={false}
        value={phone_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              name,
              user_role,
              family_name,
              given_name,
              middle_name,
              nickname,
              preferred_username,
              profile,
              picture,
              website,
              gender,
              birthdate,
              zoneinfo,
              locale,
              address,
              email,
              phone_number: value,
            };
            const result = onChange(modelFields);
            value = result?.phone_number ?? value;
          }
          if (errors.phone_number?.hasError) {
            runValidationTasks("phone_number", value);
          }
          setPhone_number(value);
        }}
        onBlur={() => runValidationTasks("phone_number", phone_number)}
        errorMessage={errors.phone_number?.errorMessage}
        hasError={errors.phone_number?.hasError}
        {...getOverrideProps(overrides, "phone_number")}
      ></TextField>

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
    </Grid>
  );
}
