import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
//import Home from './Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        {<Route path= "/" element={<Home />} /> }
      </Routes>

    </BrowserRouter>
  )
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Navigation from "./Navigation";
import Recipes from "./Recipes";
import ViewItems from "./ViewItems";

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/items" element={<ViewItems />} />
      </Routes>
    </BrowserRouter>
  );
}
