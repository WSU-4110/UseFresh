
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from "./Home";
import Navigation from "./Navigation";
import Recipes from "./Recipes";
import ViewItems from "./ViewItems";
import SavedRecipes from "./SavedRecipes";
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function AppRoutes() {
  const location = useLocation();
  const hideNavigation = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" || 
  location.pathname == "/forgot_password" || location.pathname.startsWith( "/reset_password");

  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/saved" element={<SavedRecipes />} />
        <Route path="/items" element={<ViewItems />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default function App() { 
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
