import React from 'react';
import { uploadData } from 'aws-amplify/storage';

export default function AddImage() {
  const [file, setFile] = React.useState();

  const handleChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
        <button
          onClick={() =>
            uploadData({
              path: `picture-submissions/${file.name}`,
              data: file,
          })
        }
      >
        Upload
      </button>
    </div>
  );
}