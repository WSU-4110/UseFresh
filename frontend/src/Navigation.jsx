//importing react tools
import { useEffect, useRef, useState } from "react";

//using navigate instead of Link so commands can control navigation
import { useNavigate } from "react-router-dom";

//importing style
import "./Navigation.css";

//importing command pattern classes
//these handle the navigation actions using the command pattern
import NavigationService from "../commands/NavigationService";
import NavigationInvoker from "../commands/NavigationInvoker";
import HomeCommand from "../commands/HomeCommand";
import ItemsCommand from "../commands/ItemsCommand";
import RecipesCommand from "../commands/RecipesCommand";

export default function Navigation() {
  //keeps track if the menu is open or closed
  const [open, setOpen] = useState(false);

  //refers to the drop down menu and use it to detect clicks
  const menuRef = useRef(null);

  //react router navigation function
  const navigate = useNavigate();

  //receiver: this actually performs the navigation
  const navigationService = new NavigationService(navigate);

  //invoker: this runs whichever command we send to it
  const navigationInvoker = new NavigationInvoker();

  //creating command objects for each menu option
  const homeCommand = new HomeCommand(navigationService);
  const itemsCommand = new ItemsCommand(navigationService);
  const recipesCommand = new RecipesCommand(navigationService);

  // closes the menu if you click outside of it
  useEffect(() => {
    //check if we clicked outside of menu
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

            {/* run the Home command when clicked */}
            <button
              onClick={() => {
                navigationInvoker.run(homeCommand);
                setOpen(false);
              }}
            >
              Home
            </button>

            {/* run the ViewItems command */}
            <button
              onClick={() => {
                navigationInvoker.run(itemsCommand);
                setOpen(false);
              }}
            >
              ViewItems
            </button>

            {/* run the Recipes command */}
            <button
              onClick={() => {
                navigationInvoker.run(recipesCommand);
                setOpen(false);
              }}
            >
              Recipes
            </button>

          </nav>
        )}
      </div>
    </header>
  );
}