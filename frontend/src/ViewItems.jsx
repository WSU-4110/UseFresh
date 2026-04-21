import { useRef, useState, useEffect } from "react";
import "./ViewItems.css";
import useFreshLogo from "./Logo/UseFreshLogo.png";
import axios from "axios";

export default function ViewItemsPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("Ready to scan.");
  const [scanResult, setScanResult] = useState(null);

  const [scanStep, setScanStep] = useState("product");
  const [productName, setProductName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [editableQuantity, setEditableQuantity] = useState("");

  const [editableProductName, setEditableProductName] = useState("");
  const [editableExpirationDate, setEditableExpirationDate] = useState("");
  const [foodForm, setFoodForm] = useState(false);
  const [removeFoodForm, setRemoveFoodForm] = useState(false);
  const [editFoodForm, setEditFoodForm] = useState(false);

  const [expirationVal, setExpirationVal] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [food, setFood] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");

  const [today, setToday] = useState(new Date());

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/foods/all", {
        params: {
          userId: localStorage.getItem("userId"),
        },
      })
      .then((response) => {
        setFood(response.data);
      })
      .catch(() => {
        alert("There was an issue loading the food items");
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const removeFields = () => {
    setFoodItem("");
    setExpirationVal("");
    setExpirationDate("");
    setQuantity("");
    setFoodForm(false);
    setRemoveFoodForm(false);
    setEditFoodForm(false);
  };

  const calculateDaysLeft = (expirationVal) => {
    const currentDay = new Date(today);
    const expire = new Date(expirationVal);

    currentDay.setHours(0, 0, 0, 0);
    expire.setHours(0, 0, 0, 0);

    const subtract = expire - currentDay;
    const daysLeft = Math.ceil(subtract / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return "Expired";
    }

    if (daysLeft === 0) {
      return "Expires today";
    }

    return daysLeft;
  };

  const getRowColorClass = (expirationVal) => {
    const currentDay = new Date(today);
    const expire = new Date(expirationVal);

    currentDay.setHours(0, 0, 0, 0);
    expire.setHours(0, 0, 0, 0);

    const subtract = expire - currentDay;
    const daysLeft = Math.ceil(subtract / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3) {
      return "food-row-red";
    } else if (daysLeft <= 7) {
      return "food-row-yellow";
    } else {
      return "food-row-green";
    }
  };

  const formatDate = (dateVal) => {
    return new Date(dateVal).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expirationVal || !foodItem) {
      alert("Please fill in the required fields!");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be at least 1.");
      return;
    }

    axios
      .post("http://localhost:3001/api/foods/add", {
        foodItem: foodItem,
        quantity: quantity || 1,
        expirationDate: expirationVal,
        user: localStorage.getItem("userId"),
      })
      .then((response) => {
        const newFood = response.data;
        setFood([...food, newFood]);
        removeFields();
      })
      .catch(() => {
        alert("Unable to add food item. Try again later!");
      });
  };

  const handleRemoveSubmit = (e) => {
    e.preventDefault();

    if (!foodItem) {
      alert("Please enter a food name to remove.");
      return;
    }

    const existingItem = food.find(
      (item) =>
        item.foodItem.trim().toLowerCase() === foodItem.trim().toLowerCase()
    );

    if (!existingItem) {
      alert("Food item not found.");
      return;
    }

    axios
      .delete(`http://localhost:3001/api/foods/${existingItem._id}`)
      .then(() => {
        setFood((currentFood) =>
          currentFood.filter((item) => item._id !== existingItem._id)
        );
        removeFields();
      })
      .catch((err) => {
        console.error("Remove failed:", err.response?.data || err.message);
        alert("Unable to remove food item. Try again later!");
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!foodItem || !quantity || !expirationDate) {
      alert("Please enter food name, quantity, and expiration date.");
      return;
    }

    const existingItem = food.find(
      (item) =>
        item.foodItem.trim().toLowerCase() === foodItem.trim().toLowerCase()
    );

    if (!existingItem) {
      alert("Food item not found to edit.");
      return;
    }

    axios
      .put(`http://localhost:3001/api/foods/${existingItem._id}`, {
        foodItem: foodItem,
        quantity: Number(quantity),
        expirationDate: expirationDate,
      })
      .then((response) => {
        const updatedFood = response.data;

        setFood((currentFood) =>
          currentFood.map((item) =>
            item._id === existingItem._id ? updatedFood : item
          )
        );
        removeFields();
      })
      .catch((err) => {
        console.error("Edit failed:", err.response?.data || err.message);
        alert("Unable to edit food item. Try again later!");
      });
  };

  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(`http://localhost:3001/api/foods/${id}`)
      .then(() => {
        setFood((currentFood) => currentFood.filter((item) => item._id !== id));
      })
      .catch(() => {
        alert("Failed to delete item");
      });
  };

  const openCamera = async () => {
    try {
      setStatus("Opening camera...");
      setCameraOpen(true);
      setScanResult(null);
      setScanStep("product");
      setProductName("");
      setExpirationDate("");
      setEditableProductName("");
      setEditableExpirationDate("");
      setEditableQuantity("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      setTimeout(async () => {
        if (videoRef.current) {
          try {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setStatus("Camera opened. Show the front product label.");
          } catch (playErr) {
            console.error("Video play failed:", playErr);
            setStatus("Camera opened, but preview failed to play.");
          }
        } else {
          setStatus("Video element not ready.");
        }
      }, 100);
    } catch (err) {
      console.error("Camera access failed:", err);
      setStatus(`Unable to access camera: ${err.message}`);
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
    setScanning(false);
    setStatus("Camera closed.");
  };

  const captureFrameBlob = () => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
        reject(new Error("Video not ready yet"));
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create image blob"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.8
      );
    });
  };

  const startScan = async () => {
    if (!cameraOpen) {
      setStatus("Open the camera first.");
      return;
    }

    setScanning(true);
    setStatus(
      scanStep === "product"
        ? "Scanning product name..."
        : "Scanning expiration date..."
    );

    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 500));

    while (Date.now() - startTime < 10000) {
      try {
        const blob = await captureFrameBlob();
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");
        formData.append("mode", scanStep);

        const response = await fetch("http://localhost:5000/scan-product", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("SCAN RESPONSE:", data);

        if (data.detected || data.product_name || data.expiration_date) {
          if (scanStep === "product") {
            setProductName(data.product_name || "");
            setEditableProductName(data.product_name || "");
            setStatus(
              `Got product: ${
                data.product_name || "Unknown"
              }. Now show the expiration label.`
            );
            setScanStep("expiration");
          } else {
            setExpirationDate(data.expiration_date || "");
            setEditableExpirationDate(data.expiration_date || "");
            setScanResult({
              product_name: productName,
              expiration_date: data.expiration_date || "",
              confidence: data.confidence || "N/A",
            });
            setStatus("Scan complete. Please review and edit if needed.");
          }

          setScanning(false);
          return;
        } else {
          setStatus(
            scanStep === "product"
              ? "Trying to read product name..."
              : "Trying to read expiration date..."
          );
        }
      } catch (err) {
        console.error("Scan error:", err);
        setStatus("Scan failed. Please enter manually.");
        setScanning(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setStatus(
      scanStep === "product"
        ? "Couldn't read product name. Please enter manually."
        : "Couldn't read expiration date. Please enter manually."
    );
    setScanning(false);
  };

  const handleSaveItem = async () => {
    try {
      const payload = {
        foodItem: editableProductName,
        quantity: Number(editableQuantity) || 1,
        expirationDate: editableExpirationDate,
        user: localStorage.getItem("userId"),
      };

      const response = await axios.post(
        "http://localhost:3001/api/foods/add",
        payload
      );
      const newFood = response.data;

      setFood([...food, newFood]);
      setStatus("Item saved successfully.");

      setScanResult(null);
      setProductName("");
      setExpirationDate("");
      setEditableProductName("");
      setEditableExpirationDate("");
      setEditableQuantity("");
    } catch (err) {
      console.error("Save failed:", err);
      setStatus("Failed to save item.");
    }
  };

  const handleScanAgain = () => {
    setScanStep("product");
    setProductName("");
    setExpirationDate("");
    setEditableProductName("");
    setEditableExpirationDate("");
    setEditableQuantity("");
    setScanResult(null);
    setStatus("Ready to scan again.");
  };

  const sortedFood = [...food].sort((a, b) => {
    return new Date(a.expirationDate) - new Date(b.expirationDate);
  });

  const foodSearched = sortedFood.filter((item) =>
    item.foodItem.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-items-page">
      <img src={useFreshLogo} alt="UseFresh logo" className="view-items-logo" />

      <h1>View Items</h1>
      <p>
        View your pantry items and scan new ones instead of typing everything by
        hand.
      </p>

      <div className="scan-actions">
        <button className="scan-btn" onClick={openCamera} disabled={cameraOpen}>
          Open Camera
        </button>

        <button
          className="scan-btn"
          onClick={startScan}
          disabled={!cameraOpen || scanning}
        >
          {scanning ? "Scanning..." : "Start Scan"}
        </button>

        <button
          className="stop-scan-btn"
          onClick={stopCamera}
          disabled={!cameraOpen}
        >
          Close Camera
        </button>
      </div>

      <div className="item-actions">
        <button
          type="button"
          className="addItem-btn"
          onClick={() => {
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
            setFoodForm(false);
            setRemoveFoodForm(false);
            setEditFoodForm(true);
          }}
        >
          Edit Food Item
        </button>
      </div>

      {cameraOpen && (
        <div className="scan-status">
          {scanStep === "product"
            ? "Step 1: Show the front product label"
            : "Step 2: Show the expiration label"}
        </div>
      )}

      <div
        className="camera-panel"
        style={{ display: cameraOpen ? "block" : "none" }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-preview"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="scan-status">{status}</div>

        <div className="scan-hint">
          {scanStep === "product"
            ? "Hold the front product label clearly in the camera."
            : "Now hold the expiration or best-by label clearly in the camera."}
        </div>

        {productName && !scanResult && (
          <div className="scan-result">
            <p>
              <strong>Product Name:</strong> {productName}
            </p>
          </div>
        )}

        {scanResult && (
          <div className="scan-result">
            <p>
              <strong>Review and edit if needed:</strong>
            </p>

            <label>
              Product Name:
              <input
                type="text"
                value={editableProductName}
                onChange={(e) => setEditableProductName(e.target.value)}
              />
            </label>

            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={editableQuantity}
                onChange={(e) => setEditableQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </label>

            <label>
              Expiration Date:
              <input
                type="date"
                value={editableExpirationDate}
                onChange={(e) => setEditableExpirationDate(e.target.value)}
              />
            </label>

            <p>
              <strong>Confidence:</strong> {scanResult.confidence}
            </p>

            <div className="scan-actions">
              <button className="scan-btn" onClick={handleSaveItem}>
                Save Item
              </button>

              <button className="manual-entry-btn" onClick={handleScanAgain}>
                Scan Again
              </button>
            </div>
          </div>
        )}
      </div>

      {foodForm && (
        <div className="form-background">
          <div className="form-box">
            <h2>Add Food Item</h2>
            <form onSubmit={handleSubmit}>
              <label>Food Name</label>
              <input
                type="text"
                placeholder="Enter food name"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
              />

              <label>Quantity</label>
              <input
                type="number"
                min="1"
                placeholder="Enter food quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <label>Expiration Date</label>
              <input
                type="date"
                value={expirationVal}
                onChange={(e) => setExpirationVal(e.target.value)}
              />

              <button type="submit" className="saveFood-btn">
                Save food item
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={removeFields}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {removeFoodForm && (
        <div className="form-background">
          <div className="form-box">
            <h2>Remove Food Item</h2>
            <form onSubmit={handleRemoveSubmit}>
              <label>Food Name</label>
              <input
                type="text"
                placeholder="Enter food name"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
              />

              <button type="submit" className="saveFood-btn">
                Remove food item
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={removeFields}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {editFoodForm && (
        <div className="form-background">
          <div className="form-box">
            <h2>Edit Food Item</h2>
            <form onSubmit={handleEditSubmit}>
              <label>Food Name</label>
              <input
                type="text"
                placeholder="Enter food name"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
              />

              <label>Quantity</label>
              <input
                type="number"
                min="1"
                placeholder="Enter new quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <label>Expiration Date</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />

              <button type="submit" className="saveFood-btn">
                Update food item
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={removeFields}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search Food Item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div className="food-table">
        <div className="food-header">
          <span>Food Item</span>
          <span>Quantity</span>
          <span>Expiration Date</span>
          <span>Days Remaining</span>
          <span>Delete</span>
        </div>

        {foodSearched.length === 0 && (
          <div className="food-row">
            <span>-</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
            <span>-</span>
          </div>
        )}

        {foodSearched.map((item, indx) => (
          <div
            className={`food-row ${getRowColorClass(item.expirationDate)}`}
            key={indx}
          >
            <span>{item.foodItem}</span>
            <span>{item.quantity}</span>
            <span>{formatDate(item.expirationDate)}</span>
            <span>{calculateDaysLeft(item.expirationDate)}</span>
            <button
              className="delete-btn"
              onClick={() => handleDeleteClick(item._id)}
              title="Delete item"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}