
//importing react tools
import { useEffect, useRef, useState } from "react";
//importing Link to move within pages without refreshing them 
import { Link } from "react-router-dom";
//importing style
import "./Navigation.css";

export default function Navigation() {
  //keeps track if the menu is open or closed
  const [open, setOpen] = useState(false);

  //refers to the drop down menu and use it to detect clicks
  const menuRef = useRef(null);

  // closes the menu if you click outside of it 
  useEffect(() => {

    //check is we clicked outside of menu
    function handleClickOutside(e) {

      //if the menu exists and the click was outside, close the menu
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    //check for mouse clicks outside the page 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div className="dropdown" ref={menuRef}>
        <button
          className="hamburger"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {"\u2630"}
        </button>

        {open && (
          <nav className="menu">
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/items" onClick={() => setOpen(false)}>
              ViewItems
            </Link>
            <Link to="/recipes" onClick={() => setOpen(false)}>
              Recipes
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
