import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export const DefaultStorageImageExample = () => {
  return <StorageImage alt="dog" path="public/IMG_5805.JPG" />;
};

const DefaultStorageManagerExample = () => {
  return (
    <StorageManager
      acceptedFileTypes={['image/*']}
      path="public/"
      maxFileCount={1}
      isResumable
    />
  );
};

export default DefaultStorageManagerExample;