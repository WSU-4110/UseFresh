//importing style
import "./ViewItems.css";
//import axios to get fooditems from the backend to the frontend
import axios from "axios";
 
import {useState, useEffect } from "react";

export default function ViewItems() {
  const [foodForm, setFoodForm] = useState(false);
  const[expirationDate, setExpirationDate] = useState("") ;
    const[foodItem, setFoodItem] = useState("");
  //holds the food items that are from the backend
  const[food, setFood] = useState([]);
  const[quantity, setQuantity] = useState("");

  useEffect(() => {
    //gets all of the food items from the backedn
  axios.get("http://localhost:3001/api/foods/all").then((response) => {
    setFood(response.data);
  })
  .catch(()=> {
    alert("There was an issue loading the food items")
  }); }, [])
    
    const removeFields = () => {
    setFoodItem("");
    setExpirationDate("");
    setQuantity("");
    setFoodForm(false);

    }
    //expiration calculation: calculates the number of days left before item expires, retruns exipred if item expired or the number of days left. 

  const calculateDaysLeft = (expirationDate) => {
    const today = new Date();
    const expire = new Date(expirationDate);
    today.setHours(0,0,0,0);
    expire.setHours(0,0,0,0);
    const subtract = expire-today
    const daysLeft = Math.ceil(subtract / (1000*60*60*24));
    if(daysLeft<0) {
      return "Expired"
    }
    
    return daysLeft
  }


  const handleSubmit = (e) => { 
    e.preventDefault();

    if(!expirationDate || !foodItem) {
      alert("Please fill in the required fields!");
      return;
      
    }
    //adding another food item to the backedn via axios
   axios.post("http://localhost:3001/api/foods/add", 
      { foodItem: foodItem, quantity: quantity, expirationDate: expirationDate}
    )
      //add new food items to the table
    .then ((response) => { 
      const newFood = response.data
      setFood([...food, newFood]);
       removeFields();})
    .catch(() => { alert ("Unable to add food item. Try again later!")});
  };  
  
    
  
    //returns what is going to be shown on the view items page
    /*food form with food name, quantity, and expiration date*/
  return (
    <main className="view-items-page">
      <h1>View Items</h1>
      <p>Items available in your feed.</p>

      <button className = "addItem-btn" onClick={() => setFoodForm(true)}>
        Add Food Item
      </button>
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
      {/* food table, with columns of food item, quanitity, expiration date, days left before expiration*/}
      <div className="food-table">

        <div className = "food-header">

          <span> Food Item </span>
           <span> Quantity </span>
          <span> Expiration Date</span>
           <span> Days Remaining</span>
        </div>
{/*if no items in current inventory this is printed in the table*/}

      {food.length == 0 && (
        <div className = "food-row">
            <span>- </span>

             <span> - </span>
            <span> -</span>
            <span> - </span>
          </div>
      )}

      {/*showing all the food items added by the in this table*/ }
       { food.map((item, indx) => (

           <div className ="food-row" key={indx}>

            <span> {item.foodItem} </span>
            <span>{item.quantity} </span>
            <span> {item.expirationDate} </span>

            <span>{calculateDaysLeft(item.expirationDate) } </span>
          </div>
        ))}
      </div>

    </main>
  );
}
