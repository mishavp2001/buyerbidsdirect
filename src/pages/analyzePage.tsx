import '@aws-amplify/ui-react/styles.css'
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import LoanCalculator from '../components/FinanceCalculator';
import CapRateCalculator from '../components/CapRateCalculator';
import TaxCalculator from '../components/TaxCalculator';

import { TabPanel } from '@mui/joy';

function toolsPage() {
    return (
        <main>
            <Tabs
                orientation="vertical"
                size="md"
            >
                <TabList>
                    <Tab>Financing</Tab>
                    <Tab>Investment</Tab>
                    <Tab>Tax</Tab>
                </TabList>
                <TabPanel value={0}>
                    <LoanCalculator />
                </TabPanel>
                <TabPanel value={1}>
                     <CapRateCalculator />
                </TabPanel>
                <TabPanel value={2}>
                    <TaxCalculator />
                </TabPanel>

            </Tabs>

        </main>
    );
}


export default toolsPage;



