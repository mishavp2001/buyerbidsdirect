import '@aws-amplify/ui-react/styles.css'
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import LoanCalculator from '../components/FinanceCalculator';
import { TabPanel } from '@mui/joy';

function homePage() {
    return (
        <main>
            <Tabs
                orientation="vertical"
                size="md"
            >
                <TabList>
                    <Tab>Financing</Tab>
                    <Tab>Tax</Tab>
                    <Tab>Profit</Tab>
                </TabList>
                <TabPanel value={0}>
                    <LoanCalculator />
                </TabPanel>
                <TabPanel value={1}>
                    Tax
                </TabPanel>
                <TabPanel value={2}>
                    Profits
                </TabPanel>
            </Tabs>

        </main>
    );
}


export default homePage;



