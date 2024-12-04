import '@aws-amplify/ui-react/styles.css'
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import CapRateCalculator from '../components/CapRateCalculator';
import TaxCalculator from '../components/TaxCalculator';
import LoanCalculator from '../components/TaxCalculator';
import SellProperty from './SellProperty'
import Profiles from './Profiles'
import Offers from '../pages/makeOfferPage'
import PostView from '../pages/Posts'
import MapWithItems from '../components/MapWithItems'
import { Divider, TabPanel } from '@mui/joy';
import Chat from '../components/Chat';

function dashboardPage() {
  return (
    <main>
      <Tabs style={{minWidth: '450px'}} orientation="vertical"
        size="md"
      >
        <TabList>
        <h5>Messages</h5>
        <Tab>New Posts</Tab>
        <Tab>My Posts</Tab>
        <h5>Properties</h5>
          <Divider
          />
          <Tab>Explore</Tab>
          <Tab>Owned</Tab>
          <Tab>Wanted</Tab>
          <h5>Contacts</h5>
          <Divider
          />
          <Tab>Personal</Tab>
          <Tab>Lenders</Tab>
          <Tab>Wholesalers</Tab>
          <Tab>Inspectors</Tab>
          <Tab>Atorneys</Tab>
          <h5>Tools</h5>
          <Divider
          />
          <Tab>AI Bot</Tab>
          <h5>Calculators</h5>
          <Divider
          />
          <Tab>Tax</Tab>
          <Tab>Investment</Tab>
          <Tab>Loan</Tab>
        </TabList>
        <TabPanel value={0}>
          <PostView />
        </TabPanel>
        <TabPanel value={1}>
          <PostView self={true}/>
        </TabPanel>
        <TabPanel value={2}>
          <MapWithItems width='100%'/>
        </TabPanel>
        <TabPanel value={3}>
          <SellProperty />
        </TabPanel>
        <TabPanel value={4}>
          <Offers />
        </TabPanel>
        <TabPanel value={5}>
          <Profiles />
        </TabPanel>
        <TabPanel value={6}>
          <Profiles />
        </TabPanel>
        <TabPanel value={7}>
          <Profiles />
        </TabPanel>
        <TabPanel value={8}>
          <Profiles />
        </TabPanel>
        <TabPanel value={9}>
          <Profiles />
        </TabPanel>
        <TabPanel value={10}>
          <Profiles />
        </TabPanel>
        <TabPanel value={11}>
          <Chat info='Investment tools' topic='Answer real estate related questions. IIntroduce yourself as expert in real estate.'/>
        </TabPanel>
        <TabPanel value={12}>
          <TaxCalculator />
        </TabPanel>
        <TabPanel value={13}>
          <CapRateCalculator />
        </TabPanel>
        <TabPanel value={14}>
          <LoanCalculator />
        </TabPanel>
      </Tabs>

    </main>
  );
}

export default dashboardPage;




