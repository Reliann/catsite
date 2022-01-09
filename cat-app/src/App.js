import './App.css';

import {HashRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/publicPages/signup';
import { E404 } from './components/generic/errors';
import Login from './components/publicPages/login';
import HomePage from './components/publicPages/homePage';
import Navbar from './components/generic/navbar';
import PrivateRoutes from './components/utils/privateRoutes';
import { AuthUserProfile } from './components/privatePages/authUserProfile';
import { AuthProvider } from './components/context/authContext';
import { AddCat } from './components/privatePages/addCat';
import UpdateUser from './components/privatePages/editUser';
import CatPage from './components/publicPages/catPage';
import CatsMainPage from './components/publicPages/catsearch';
import EditCat from './components/privatePages/editCat';
import UserProfile from './components/publicPages/userProfile';
import Credit from './components/generic/credit';
import { Box } from '@mui/system';

function App() {
  return (
    <div className="App">
      <Box minHeight = "80vh" className="App">
        <AuthProvider>
        <HashRouter>
          <Navbar/>
          <Routes>
            <Route path = "signup" element={<Signup/>} />
            <Route path = "login" element={<Login/>} />
            <Route path = "" element={<HomePage/>} />
            <Route path = "users/:username" element={<UserProfile/>} />
            {/* those routes are routes only logged user can acsses */}
            <Route path = "user" element={<PrivateRoutes/>}>
              {/* options for logged user */}
              <Route path = "" element={<AuthUserProfile/>}/>
              <Route path = "addCat" element={<AddCat/>}/>
              <Route path = "edit" element={<UpdateUser/>}/>
              <Route path = ":id/edit" element={<EditCat/>}/>
            </Route>
            <Route path = "cats/:id" element={<CatPage/>}/>
            <Route path = "cats" element={<CatsMainPage/>}/>
            <Route path = "*" element={<E404/>} />
          </Routes>
        </HashRouter>
        </AuthProvider>
      </Box>
      <Credit/>
    </div>
  );
}

export default App;
