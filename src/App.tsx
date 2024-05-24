
import { Authenticator } from '@aws-amplify/ui-react'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import { Route, Routes } from 'react-router-dom';
import MakeOffer from './pages/makeOfferPage';
import ListProperty from './pages/listProperty';
import Profile from './pages/Profile';
import NavigationBar from './components/NavigationBar'

import RequireAuth from './components/Auth/RequireAuth';

function App() {

  return (

    <Authenticator.Provider>
      <NavigationBar/>
      <Routes>
        <Route index path='/' element = {<HomePage/>} />
        <Route path='/offers/:offerId' element = {<RequireAuth><MakeOffer/></RequireAuth>} />
        <Route path='/offers' element = {<RequireAuth><MakeOffer/></RequireAuth>} />
        <Route path='/sales' element = {<RequireAuth><ListProperty/></RequireAuth>} />
        <Route path='/profile' element =  {<RequireAuth><Profile/></RequireAuth>} />
        <Route path='/login' element = {<LoginPage/>} />

      </Routes>
    </Authenticator.Provider>
  );
}

export default App;
