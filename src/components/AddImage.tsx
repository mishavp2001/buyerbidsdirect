import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export const DefaultStorageImageExample = () => {
  return <StorageImage alt="dog" path="picture-submissions/IMG_5805.JPG" />;
};

const DefaultStorageManagerExample = () => {
  return (
    <StorageManager
      acceptedFileTypes={['image/*']}
      path="picture-submissions/"
      maxFileCount={1}
      isResumable
    />
  );
};

export default DefaultStorageManagerExample;