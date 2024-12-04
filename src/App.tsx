
import { Authenticator } from '@aws-amplify/ui-react'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import PrivacyPage from './pages/privacyPage';
import DeleteDataPage from './pages/deleteDataPage';
import MakeOffer from './pages/makeOfferPage';
import SellProperty from './pages/SellProperty';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/Profile';
import UserProfiles from './pages/Profiles';
import ProfileAdd from './pages/ProfileAdd';
import PropertyPage from './pages/PropertyPage';
import NavigationBar from './components/NavigationBar'
import AnalyzePage from './pages/analyzePage'
import RequireAuth from './components/Auth/RequireAuth';
import Posts from './pages/Posts';

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';


function App() {
  const location = useLocation();

  // Save the background location when navigating to a modal
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation || location;

  return (
    <Authenticator.Provider>
      <NavigationBar />
      <>
        <Routes location={backgroundLocation}>
          <Route index path='/' element={<HomePage />} />
          <Route index path='/:currentTab' element={<HomePage />} />
          <Route path='/offers' element={<RequireAuth><MakeOffer /></RequireAuth>} />
          <Route path='/offers/:offerId/:address/:propertyId/:ownerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />
          <Route path='/offers/:offerId/:address' element={<RequireAuth><MakeOffer /></RequireAuth>} />
          <Route path='/offers/:offerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />
          <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/dashboard/:currentTab' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/calc' element={<AnalyzePage />} />
          <Route path='/sales' element={<RequireAuth><SellProperty /></RequireAuth>} />
          <Route path='/sales/:propertyId' element={<RequireAuth><SellProperty /></RequireAuth>} />
          <Route path='/offers/:offerId/:address/:propertyId/:ownerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />
          <Route path='/profile' element={<RequireAuth><UserProfile /></RequireAuth>} />
          <Route path='/profiles' element={<UserProfiles />} />
          <Route path='/profiles/:userId' element={<UserProfiles />} />
          <Route path='/posts' element={<Posts />} />
          <Route path='/posts/:postId' element={<Posts />} />
          <Route path='/profileadd' element={<RequireAuth><ProfileAdd /></RequireAuth>} />
          <Route path='/profile/:update' element={<RequireAuth><UserProfile /></RequireAuth>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/privacy' element={<PrivacyPage />} />
          <Route path='/deletedata' element={<DeleteDataPage />} />
          <Route path='/property/:propertyId' element={<RequireAuth><PropertyPage /></RequireAuth>} />
          <Route path='/offers/:offerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />
          <Route path='/sales/:propertyId' element={<RequireAuth><SellProperty /></RequireAuth>} />
        </Routes>
        {/* Modal Route */}
        {location.state?.isModal && (
          <Routes>
            <Route path='/property/:propertyId' element={<RequireAuth><PropertyPage /></RequireAuth>} />
            <Route path='/offers/:offerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />
            <Route path='/sales/:propertyId' element={<RequireAuth><SellProperty /></RequireAuth>} />
            <Route path='/offers/:offerId/:address/:propertyId/:ownerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />
            <Route path='/offers/:offerId/:address' element={<RequireAuth><MakeOffer /></RequireAuth>} />
            <Route path='/offers/:offerId' element={<RequireAuth><MakeOffer /></RequireAuth>} />

          </Routes>
        )}
      </>
    </Authenticator.Provider>
  );
}

export default App;
