//importing style
import "./Home.css";
//axios is used to send fronend data to backend
import axios from "axios";
 
import {useState } from "react";

export default function Home() {

  const [foodForm, setFoodForm] = useState(false);
  const[expirationDate, setExpirationDate] = useState("") ;
  const[foodItem, setFoodItem] = useState("");
  const[quantity, setQuantity] = useState("")
//if the form is canceled or submitted, the form fields are cleared/removed
  const removeFields = () => {
    setFoodItem("");
  setExpirationDate("");
  setQuantity("");
  setFoodForm(false);
  }
  const handleSubmit = (e) => { 
    e.preventDefault();
    //checks to see if any fields are missing if, the are error message is displayed
    if(!expirationDate || !foodItem || !quantity) {
      alert("Please fill in the required fields!");
      
    }
   
    //sends food item and the expiration date to the backend
   /* axios.post("http://localhost:3001/(backendstuff)", 
      { foodItem: foodItem, quantity: quantity, expirationDate: expirationDate})
    .then (() => { alert("Food item sccessfully added!")
    removeFields()})
    .catch(() => { alert ("Unable to add food item. Try again later!")});
  };  */
  
    
  }
  
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

