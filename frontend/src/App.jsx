import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from "./Home";
import Navigation from "./Navigation";
import Recipes from "./Recipes";
import ViewItems from "./ViewItems";

function AppRoutes() {
  const location = useLocation();
  const hideNavigation = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/items" element={<ViewItems />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
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