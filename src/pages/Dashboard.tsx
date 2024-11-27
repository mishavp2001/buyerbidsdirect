import '@aws-amplify/ui-react/styles.css'
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import CapRateCalculator from '../components/CapRateCalculator';
import TaxCalculator from '../components/TaxCalculator';
import SellProperty from './SellProperty'
import Profiles from './Profiles'
import Offers from '../pages/makeOfferPage'
import { TabPanel } from '@mui/joy';

function dashboardPage() {
    return (
        <main>
            <Tabs
                orientation="vertical"
                size="md"
            >
                <TabList>
                    <Tab>Owned</Tab>
                    <Tab>Targets</Tab>
                    <Tab>Contacts</Tab>
                    <Tab>Documents</Tab>
                </TabList>
                <TabPanel value={0}>
                    <SellProperty />
                </TabPanel>
                <TabPanel value={1}>
                     <Offers />
                </TabPanel>
                <TabPanel value={2}>
                    <Profiles />
                </TabPanel>
                <TabPanel value={3}>
                    <TaxCalculator />
                </TabPanel>
            </Tabs>

        </main>
    );
}


export default dashboardPage;




