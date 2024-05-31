import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export const ImageShow = (alt:string, path:string) => {
  return <StorageImage alt={alt} path={path} />;
};

const StorageLoad = () => {
  return (
    <StorageManager
      acceptedFileTypes={['image/*']}
      path="picture-submissions/"
      maxFileCount={1}
      isResumable
    />
  );
};

export default StorageLoad;