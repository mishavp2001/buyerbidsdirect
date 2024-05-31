import '@aws-amplify/ui-react/styles.css'
import MapWithItems from '../components/MapWithItems';
import AddImage, {DefaultStorageImageExample}  from '../components/AddImage';

function homePage() {
    return (
        <main>         
        <MapWithItems />
        <AddImage />
        <DefaultStorageImageExample />;
    </main>
    );
}


export default homePage;



