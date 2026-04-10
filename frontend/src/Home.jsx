//importing style
import "./Home.css";
//axios is used to send fronend data to backend
import axios from "axios";
import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const nav = useNavigate();
//looks for userId in local storage if it doesnt exist the user is not logged in and goes to login page
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      //also prevents the user from going back to the home page 
      nav("/", { replace: true });
    }
  }, []);
//stores information that user inputs, and controls whether food form is shown, as well as storing all the food items from the backend. 
  const [foodForm, setFoodForm] = useState(false);
  const[expirationDate, setExpirationDate] = useState("") ;
  const[foodItem, setFoodItem] = useState("");
  const[quantity, setQuantity] = useState("")
  const[food, setFood] = useState([]);
 

  //when page loads a get request is sent to the backend to get the food from the users pantry/inventory, the userId is the parameter which is sent. 
  useEffect(() => {
    axios.get("http://localhost:3001/api/foods/all", {
      params: { userId: localStorage.getItem("userId"), },
    })
    //if successful in getting the food, the food is stored in a food state var. 
        .then((response) => {
          setFood(response.data);
        })
        //if food items cannot be loaded from the backend then an error message is displayed . 
        .catch(() => {
          alert("Unable to load food items from pantry");
        });
  }, []); 


//if the form is canceled or submitted, the form fields are cleared/removed
  const removeFields = () => {
    setFoodItem("");
  setExpirationDate("");
  setQuantity("");
  setFoodForm(false);
  }
//function which calculates the number of days left before food expires. 

  const calculateDaysLeft = (expirationVal) => {
    //var today for current date, var expire for expiration date
    const today = new Date();

    const expire = new Date(expirationVal);
    //only the dates are compared not time so time is set to 0. 
    today.setHours(0, 0, 0, 0);
    expire.setHours(0, 0, 0, 0);
//gets the different and converts from miliseconds to days. 
    const subtract = expire - today;
    const daysLeft = Math.ceil(subtract / (1000 * 60 * 60 * 24));

 //if loop to see if the food is expired, if so then "Expired" is returned
 // If not then the number of days left is returned.
    if (daysLeft < 0) {
      return "Expired";
    }
    return daysLeft;

  };

 

  const formatDate = (dateVal) => {
    //date is formatted to be month /day /year
    return new Date(dateVal).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    //checks to see if any fields are missing if, the are error message is displayed
    if(!expirationDate || !foodItem || !quantity) {
      alert("Please fill in the required fields!");
      return;
      
    }

    if(quantity <= 0) {
      alert("Quantity must be at least 1. ");
      return;
    }

    //sends food item and the expiration date to the backend, updates the page without the user having to refresh the page.
    axios.post("http://localhost:3001/api/foods/add", 
      { foodItem: foodItem, quantity: quantity, expirationDate: expirationDate, user: localStorage.getItem("userId")})
    .then (() => { 
      alert("Food item successfully added!")
      setFood((prevFood) => [...prevFood, { foodItem, quantity, expirationDate }]);
    removeFields();})
    .catch(() => {
       alert ("Unable to add food item. Try again later!")});
  };  
//expiring soon, filters through the food itmes
  const expiringSoon = food.filter((item) => {
    //if the number of days left is less than or equal to 3 then the food item is considered to be expiring soon.
    const daysLeft = calculateDaysLeft(item.expirationDate);
    return daysLeft !== "Expired" && daysLeft <=3;

  })
//expired food, filters through food items
  const expiredItems = food.filter((item) => {
    //if the number of days left is expired then the food item is considered to be expired.
    return calculateDaysLeft(item.expirationDate) == "Expired" ;

  })
  //newly added food, takes the last 3 food items that were just added to the pantry and shows them in most recent order. 
  const newItems = [...food].slice(-3).reverse();
    
  
  
  //displays what is shown on the home page, summary of total items,
  //expiring soon, expired, just added items and the button to add food to pantry with the add food form. 
  return (
    <main className="home-page">
      <h1>Home</h1>
      <p>Welcome to UseFresh.</p>
{/* this is the button for the food form*/}
      <div className = "button-section">
      <button className = "main-btn" onClick = {() => setFoodForm(true)}>
        Add Food Item
      </button>

      </div>

      <div className = "summary-section">
        <div className = "summary-card" >
          <h3> Total Items</h3> 

          <p>{food.length}</p>
        </div>

        <div className = "summary-card" >
          <h3>Expiring Soon</h3>
          <p>{expiringSoon.length} </p>
        </div>

        <div className="summary-card">
          <h3>Expired</h3>
          <p> {expiredItems.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className= "dashboard-box">
          <h2>Expiring Soon</h2>
{/* dashboard section expiring soon, where goes through items, shows the food name, and then info like quantity, expiration date, and datys left*/}
    {expiringSoon.length === 0 && <p>No items expiring soon. </p>}
   
      {expiringSoon.length > 0 && expiringSoon.map((item, index) => (

        <div key={index} className="dashboard-item">
        <strong>{item.foodItem}</strong>

        <div>Qty: {item.quantity} </div>
        <div>Expires: {formatDate(item.expirationDate) }</div>
        <div>Days Left: {calculateDaysLeft(item.expirationDate)} </div>
        </div>

      ))}
    
   </div>
   <div className="dashboard-box">
          <h2>Expired</h2>
{/* dashboard section expired, where goes through items, shows the food name, and then info like quantity, expiration date, and datys left*/}
    {expiredItems.length === 0 && 
      <p>No items expired. </p>
    }
    {expiredItems.length > 0 &&  expiredItems.map((item, index) => (

        <div key={index} className="dashboard-item">
        <strong>{item.foodItem}</strong>

        <div>Qty: {item.quantity} </div>
        <div>Expires: {formatDate(item.expirationDate) }</div>
        <div>Days Left: {calculateDaysLeft(item.expirationDate)} </div>
        </div>

      ))}
    
    </div>
   <div className="dashboard-box">
  <h2>Newly Added</h2>
{/* dashboard section newly added, where goes through items, shows the food name, and then info like quantity, expiration date, and days left*/}
  {newItems.length === 0 && <p>No recently added items</p>}
  {newItems.length > 0 && 
    newItems.map((item, index) => (

      <div key={index} className="dashboard-item">
        <strong>{item.foodItem}</strong>
        <div>Qty: {item.quantity} </div>
        <div>Expires: {formatDate(item.expirationDate)} </div>
        <div>Days Left: {calculateDaysLeft(item.expirationDate)} </div>
      </div>

    ))}

</div>
</div>
      {/* This is the food form, required user to fill out food item, quantity, and the expiration date. */}
      {foodForm && ( 
        <div className = "form-background">
          <div className = "form-box">
            
            <h2> Add Food Item</h2>
            <form onSubmit = {handleSubmit}>
           
            <label> Food Name </label>
              <input 
                type = "text"
                 placeholder = "Enter food name"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
              />  
            <label> Quantity </label>
              <input 
                type = "number"
                 placeholder = "Enter food quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />

            <label> Expiration Date</label>
              <input 
              type = "date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              />

          <button type = "submit" className = "saveFood-btn">
              Save food item
          </button>
          <button type = "button" className = "cancel-btn" onClick={removeFields}>
              Cancel 

          </button>
            </form>
          </div>
        </div>
      )}
     
    </main>
  );

}

