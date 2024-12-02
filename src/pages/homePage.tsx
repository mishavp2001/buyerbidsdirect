import '@aws-amplify/ui-react/styles.css'
import MapWithItems from '../components/MapWithItems';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Dashboard from './Dashboard';

function homePage() {
    const { user } = useAuthenticator((context) => [context.user]);

    return (
        <main>
           { user? 
            <Dashboard /> :  <MapWithItems />
           }
        </main>
    );
}


export default homePage;



