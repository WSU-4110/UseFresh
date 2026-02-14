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
