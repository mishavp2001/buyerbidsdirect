/* eslint-disable */
"use client";
import * as React from "react";
import { Grid } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { StorageImage } from '@aws-amplify/ui-react-storage';

const client = generateClient();

export default function PostView(props) {
  const { id: idProp, userProfile: userProfileModelProp } = props;

  const initialValues = {
    id: "",
    name: "",
    picture: "",
    title: "",
    post: "",
    email: "",
    phone_number: "",
  };

  const [PostRecord, setPostView] = React.useState(
    userProfileModelProp || initialValues
  );

  React.useEffect(() => {
    const fetchPost = async () => {
      if (idProp) {
        const { data: items, errors } = await client.models.Post.list({
          filter: { id: { eq: idProp } },
          authMode: "identityPool"
        })
        setPostView(items[0] || initialValues);
      }
    };
    fetchPost();
  }, [idProp]);

  const renderField = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
      <strong style={{ marginRight: "10px" }}>{label}:</strong>
      <span>{value || "N/A"}</span>
    </div>
  );

  const renderPicture = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
      {value && <StorageImage alt={label} path={`compressed/{${value}`} />}
    </div>
  );

  return (
    <>
      <Grid as="div" templateColumns="1fr 1fr" gap="25px" padding="20px" style={{ maxWidth: "800px" }}>
        {renderField("Name", PostRecord.name)}
        {renderField("Title", PostRecord.title)}
        {renderField("Post", PostRecord.post)}
        {renderField("Post", PostRecord.website)}
        {renderField("email", PostRecord.email)}
        {renderField("Email", PostRecord.email)}
        {renderField("Phone Number", PostRecord.phone_number)}
      </Grid>
      {renderPicture("Picture", PostRecord.picture)}
    </>

  );
}
