import '@aws-amplify/ui-react/styles.css'
import MapWithItems from '../components/MapWithItems';
import AddImage from '../components/AddImage';

function homePage() {
    return (
        <main>         
        <MapWithItems />
        <AddImage />
      </main>
    );
}


export default homePage;



