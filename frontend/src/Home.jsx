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
    
    document.title = "Home - UseFresh";
  }, []);
//stores information that user inputs, and controls whether food form is shown, as well as storing all the food items from the backend. 
  const [foodForm, setFoodForm] = useState(false);
  const[expirationDate, setExpirationDate] = useState("") ;
  const[foodItem, setFoodItem] = useState("");
  const[quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  //const nav = useNavigate();
//if the form is canceled or submitted, the form fields are cleared/removed
  const removeFields = () => {
    setFoodItem("");
  setExpirationDate("");
  setQuantity("");
  setFoodForm(false);
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  // validation FIRST 
  if (!expirationDate || !foodItem || !quantity) {
    alert("Please fill in the required fields!");
    return;
  }

  setLoading(true); // START loading

  try {
    await axios.post("http://localhost:3001/api/foods/add", {
      foodItem: foodItem,
      quantity: quantity,
      expirationDate: expirationDate,
      user: localStorage.getItem("userId"),
    });

    alert("Food item successfully added!");
    removeFields();

  } catch (err) {
    console.log(err);
    alert("Unable to add food item. Try again later!");

  } finally {
    setLoading(false); // STOP loading (always runs)
  }
}; 
    
  //returns what will show on the Home page
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

          <button type="submit" className="saveFood-btn" disabled={loading}>
            {loading ? "Saving..." : "Save food item"}
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

