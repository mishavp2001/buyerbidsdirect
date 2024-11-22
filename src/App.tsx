
import { Authenticator } from '@aws-amplify/ui-react'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import PrivacyPage from './pages/privacyPage';
import DeleteDataPage from './pages/deleteDataPage';
import { Route, Routes } from 'react-router-dom';
import MakeOffer from './pages/makeOfferPage';
import SellProperty from './pages/SellProperty';
import UserProfile from './pages/Profile';
import PropertyPage from './pages/PropertyPage';
import NavigationBar from './components/NavigationBar'
import AnalyzePage from './pages/analyzePage'
import RequireAuth from './components/Auth/RequireAuth';

function App() {

  return (
      <Authenticator.Provider>
      <NavigationBar/>
      <Routes>
        <Route index path='/' element = {<HomePage/>} />
        <Route path='/offers/:offerId/:address/:propertyId/:ownerId' element = {<RequireAuth><MakeOffer/></RequireAuth>} />
        <Route path='/offers/:offerId/:address' element = {<RequireAuth><MakeOffer/></RequireAuth>} />
        <Route path='/offers/:offerId' element = {<RequireAuth><MakeOffer/></RequireAuth>} />
        <Route path='/sales/:propertyId' element = {<RequireAuth><SellProperty/></RequireAuth>} />
        <Route path='/offers' element = {<RequireAuth><MakeOffer/></RequireAuth>} />
        <Route path='/property/:propertyId' element = {<RequireAuth><PropertyPage/></RequireAuth>} />
        <Route path='/calc' element = {<AnalyzePage/>} /> 
        <Route path='/sales' element = {<RequireAuth><SellProperty/></RequireAuth>} />
        <Route path='/profile' element =  {<RequireAuth><UserProfile/></RequireAuth>} />
        <Route path='/profile/:update' element =  {<RequireAuth><UserProfile/></RequireAuth>} />
        <Route path='/login' element = {<LoginPage/>} />
        <Route path='/privacy' element = {<PrivacyPage/>} />
        <Route path='/deletedata' element = {<DeleteDataPage/>} />
      </Routes>
    </Authenticator.Provider>   
  );
}

export default App;
