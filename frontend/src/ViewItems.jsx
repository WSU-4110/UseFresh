import { useRef, useState, useEffect } from "react";
import "./ViewItems.css";

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

  const [editableProductName, setEditableProductName] = useState("");
  const [editableExpirationDate, setEditableExpirationDate] = useState("");

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

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
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

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }
        resolve(blob);
      }, "image/jpeg", 0.8);
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
    // give camera half a second to stabilize
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    while (Date.now() - startTime < 10000) {
      try {
        const blob = await captureFrameBlob();
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");
        formData.append("mode", scanStep);

        const response = await fetch("http://localhost:5000/scan-product", {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        console.log("SCAN RESPONSE:", data);

        if (data.detected || data.product_name || data.expiration_date) {
          if (scanStep === "product") {
            setProductName(data.product_name);
            setEditableProductName(data.product_name || "");
            setStatus(`Got product: ${data.product_name}. Now show the expiration label.`);
            setScanStep("expiration");
          } else {
            setExpirationDate(data.expiration_date);
            setEditableExpirationDate(data.expiration_date || "");
            setScanResult({
              product_name: productName,
              expiration_date: data.expiration_date,
              confidence: data.confidence
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

  const handleSaveItem = () => {
    const finalItem = {
      product_name: editableProductName,
      expiration_date: editableExpirationDate
    };

    console.log("Saving item:", finalItem);
    setStatus("Item confirmed and ready to save.");
  };

  const handleScanAgain = () => {
    setScanStep("product");
    setProductName("");
    setExpirationDate("");
    setEditableProductName("");
    setEditableExpirationDate("");
    setScanResult(null);
    setStatus("Ready to scan again.");
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="view-items-page">
      <h1>UseFresh</h1>
      <p>
        View your pantry items and scan new ones instead of typing everything by hand.
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

        <button className="manual-entry-btn">
          Enter Manually
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
            <p><strong>Product Name:</strong> {productName}</p>
          </div>
        )}

        {scanResult && (
          <div className="scan-result">
            <p><strong>Review and edit if needed:</strong></p>

            <label>
              Product Name:
              <input
                type="text"
                value={editableProductName}
                onChange={(e) => setEditableProductName(e.target.value)}
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

            <p><strong>Confidence:</strong> {scanResult.confidence}</p>

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
    </div>
  );
}