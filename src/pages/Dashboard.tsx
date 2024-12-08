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
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Menu } from '@mui/icons-material';
import { useState } from 'react';
import classNames from 'classnames';

function dashboardPage() {
  const { currentTab } = useParams();
  const navigate = useNavigate();
  const [navShow, setNavShow] = useState(false);
  const handleTabChange = (_event: any, newPath: any) => {
    navigate(`/${newPath}`);; // Update the URL
  };

  return (
    <main>
      <Tabs className='dash-tabs' 
        orientation="vertical"
        size="md"
        onChange={handleTabChange}
        value={currentTab ? currentTab : '0'}
      >
       <Menu className='dash-nav' onClick={()=>setNavShow(!navShow)}/>
        <TabList className={classNames('dash-list', `${navShow ? 'dash-list-show' : 'dash-list-hide'}`)}>
        <h5>Articles</h5>
        <Tab>Read</Tab>
        <Tab>Write</Tab>
        <h5>Properties</h5>
          <Divider
          />
          <Tab>Explore</Tab>
          <Tab>Owned</Tab>
          <Tab>Saved</Tab>
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
        <TabPanel value='0'>
          <PostView />
        </TabPanel>
        <TabPanel value='1'>
          <PostView self={true}/>
        </TabPanel>
        <TabPanel value='2'>
          <MapWithItems width='100%'/>
        </TabPanel>
        <TabPanel value='3'>
          <SellProperty />
        </TabPanel>
        <TabPanel value='4'>
          <Offers />
        </TabPanel>
        <TabPanel value='5'>
          <Profiles />
        </TabPanel>
        <TabPanel value='6'>
          <Profiles />
        </TabPanel>
        <TabPanel value='7'>
          <Profiles />
        </TabPanel>
        <TabPanel value='8'>
          <Profiles />
        </TabPanel>
        <TabPanel value='9'>
          <Profiles />
        </TabPanel>
        <TabPanel value='10'>
          <Profiles />
        </TabPanel>
        <TabPanel value='11'>
          <Chat info='Investment tools' topic='Answer real estate related questions. IIntroduce yourself as expert in real estate.'/>
        </TabPanel>
        <TabPanel value='12'>
          <TaxCalculator />
        </TabPanel>
        <TabPanel value='13'>
          <CapRateCalculator />
        </TabPanel>
        <TabPanel value='14'>
          <LoanCalculator />
        </TabPanel>
      </Tabs>

    </main>
  );
}

export default dashboardPage;




