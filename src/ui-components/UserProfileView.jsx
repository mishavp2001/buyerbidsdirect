/* eslint-disable */
"use client";
import * as React from "react";
import { Grid } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { StorageImage } from '@aws-amplify/ui-react-storage';

const client = generateClient();

export default function UserProfileView(props) {
  const { id: idProp, userProfile: userProfileModelProp } = props;

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

  const [userProfileRecord, setUserProfileRecord] = React.useState(
    userProfileModelProp || initialValues
  );

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (idProp) {
        const { data: items, errors } = await client.models.UserProfile.list({
          filter: { id: { eq: idProp } },
          authMode: "identityPool"
        })
        setUserProfileRecord(items[0] || initialValues);
      }
    };
    fetchUserProfile();
  }, [idProp]);

  const renderField = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
      <strong style={{ marginRight: "10px" }}>{label}:</strong>
      <span>{value || "N/A"}</span>
    </div>
  );

  const renderPicture = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
      {value && <StorageImage minWidth='350px' alt={label} path={`compressed/${value}`} />}
    </div>
  );

  return (
    <>
      <Grid as="div" templateColumns="1fr 1fr" gap="25px" padding="20px" style={{ maxWidth: "800px" }}>
        {renderField("Name", userProfileRecord.name)}
        {renderField("User Role", userProfileRecord.user_role)}
        {renderField("Family Name", userProfileRecord.family_name)}
        {renderField("Given Name", userProfileRecord.given_name)}
        {renderField("Middle Name", userProfileRecord.middle_name)}
        {renderField("Nickname", userProfileRecord.nickname)}
        {renderField("Preferred Username", userProfileRecord.preferred_username)}
        {renderField("Profile", userProfileRecord.profile)}
        {renderField("Website", userProfileRecord.website)}
        {renderField("Gender", userProfileRecord.gender)}
        {renderField("Birthdate", userProfileRecord.birthdate)}
        {renderField("Zoneinfo", userProfileRecord.zoneinfo)}
        {renderField("Locale", userProfileRecord.locale)}
        {renderField("Address", userProfileRecord.address)}
        {renderField("Email", userProfileRecord.email)}
        {renderField("Phone Number", userProfileRecord.phone_number)}
      </Grid>
      {renderPicture("Picture", userProfileRecord.picture)}
    </>

  );
}
