//importing style
import "./ViewItems.css";
import useFreshLogo from "./Logo/UseFreshLogo.png";
//import axios to get fooditems from the backend to the frontend
import axios from "axios";
 
import {useState, useEffect } from "react";

export default function ViewItems() {
  const [foodForm, setFoodForm] = useState(false);
  //opens remove popup
  const [removeFoodForm, setRemoveFoodForm] = useState(false);
  //opens edit popup
  const [editFoodForm, setEditFoodForm] = useState(false);
  const[expirationDate, setExpirationDate] = useState("") ;
    const[foodItem, setFoodItem] = useState("");
  //holds the food items that are from the backend
  const[food, setFood] = useState([]);
  const[quantity, setQuantity] = useState("");

   useEffect(() => {
    //gets all of the food items from the backedn
  axios.get("https://localhost:3001/api/foods/all").then((response) => {
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
    setRemoveFoodForm(false);
    setEditFoodForm(false);

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
    axios.post("https://localhost:3001/api/foods/add", 
      { foodItem: foodItem, quantity: quantity, expirationDate: expirationDate}
    )
      //add new food items to the table
    .then ((response) => { 
      const newFood = response.data
      setFood([...food, newFood]);
       removeFields();})
    .catch(() => { alert ("Unable to add food item. Try again later!")});
  };  
  
    removeFields();
  }

  const handleRemoveSubmit = (e) => {
    e.preventDefault();

    //quick check: user has to type both values or we cannot match anything
    if (!foodItem || !quantity) {
      alert("Please enter a food name and quantity to remove.");
      return;
    }

    //for now this is only local (backend delete route is still TODO)
    setFood((currentFood) => {
      //find exact row by name + quantity (name compare is case-insensitive)
      const foodIndex = currentFood.findIndex(
        (item) =>
          item.foodItem.toLowerCase() === foodItem.toLowerCase() &&
          String(item.quantity) === String(quantity)
      );

      //if we don't find a match, tell the user and keep list unchanged
      if (foodIndex === -1) {
        alert("That food item and quantity was not found.");
        return currentFood;
      }

      //copy array first so React sees a new reference, then remove one item
      const updatedFood = [...currentFood];
      updatedFood.splice(foodIndex, 1);
      return updatedFood;
    });

    //removing food item from the backend via axios
    axios.delete("https://localhost:3001/api/foods/:id", {
      data: { foodItem: foodItem, quantity: quantity }
    })
    //remove food item from the table
    .then(() => {
      setFood((currentFood) =>
        currentFood.filter(
          (item) =>
            !(
              item.foodItem.toLowerCase() === foodItem.toLowerCase() &&
              String(item.quantity) === String(quantity)
            )
        )
      );
      removeFields();
    })
    .catch(() => { alert("Unable to remove food item. Try again later!"); });
    return; 

    removeFields();
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();

    //for editing, all 3 fields are needed so we know what to update
    if (!foodItem || !quantity || !expirationDate) {
      alert("Please enter food name, quantity, and expiration date.");
      return;
    }

    //flag so we can tell if anything was actually updated
    let didUpdate = false;
    //temporary local edit until backend route is ready
    setFood((currentFood) =>
      currentFood.map((item) => {
        //match by food name (ignore uppercase/lowercase differences)
        if (item.foodItem.toLowerCase() === foodItem.toLowerCase()) {
          didUpdate = true;
          //return a new updated object instead of mutating the old one
          return {
            ...item,
            quantity: quantity,
            expirationDate: expirationDate,
          };
        }
        //if this row is not the match, leave it unchanged
        return item;
      })
    );

    //if no match was found, let the user know
    if (!didUpdate) {
      alert("Food item not found to edit.");
      return;
    }

    //editing food item in the backend via axios
    axios.put("https://localhost:3001/api/foods/:id",
      { foodItem: foodItem, quantity: quantity, expirationDate: expirationDate }
    )
    //update edited food item in the table
    .then(() => {
      setFood((currentFood) =>
        currentFood.map((item) => {
          if (item.foodItem.toLowerCase() === foodItem.toLowerCase()) {
            return {
              ...item,
              quantity: quantity,
              expirationDate: expirationDate,
            };
          }
          return item;
        })
      );
      removeFields();
    })
    .catch(() => { alert("Unable to edit food item. Try again later!"); });
    return;

    removeFields();
  }
    //returns what is going to be shown on the view items page
    /*food form with food name, quantity, and expiration date*/
  return (
    <main className="view-items-page">
      {/*logo placement*/}
      <img src={useFreshLogo} alt="UseFresh logo" className="view-items-logo" />
      <h1>View Items</h1>
      <p>Items available in your feed.</p>

      <div className="item-actions">
        <button
          type="button"
          className="addItem-btn"
          onClick={() => {
            //close other popups first
            setRemoveFoodForm(false);
            setEditFoodForm(false);
            setFoodForm(true);
          }}
        >
          Add Food Item
        </button>
        <button
          type="button"
          className="removeItem-btn"
          onClick={() => {
            //only keep remove popup open
            setFoodForm(false);
            setEditFoodForm(false);
            setRemoveFoodForm(true);
          }}
        >
          Remove Food Item
        </button>
        <button
          type="button"
          className="editItem-btn"
          onClick={() => {
            //only keep edit popup open
            setFoodForm(false);
            setRemoveFoodForm(false);
            setEditFoodForm(true);
          }}
        >
          Edit Food Item
        </button>
      </div>
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
      {removeFoodForm && (
        <div className = "form-background">
          <div className = "form-box">
            <h2> Remove Food Item</h2>
            <form onSubmit = {handleRemoveSubmit}>
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
                placeholder = "Enter quantity to remove"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <button type = "submit" className = "saveFood-btn">
                Remove food item
              </button>
              <button type = "button" className = "cancel-btn" onClick={removeFields}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {editFoodForm && (
        <div className = "form-background">
          <div className = "form-box">
            <h2> Edit Food Item</h2>
            <form onSubmit = {handleEditSubmit}>
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
                placeholder = "Enter new quantity"
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
                Update food item
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


