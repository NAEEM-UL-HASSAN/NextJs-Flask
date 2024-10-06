"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [image, setImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
      : "http://localhost:8000/api";

    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(`${URL}/detect`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Display the detected objects
      setDetectedObjects(response.data.detected_objects);
    } catch (error) {
      console.error("Error detecting objects", error);
      alert("Failed to detect objects");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          width: "300px",
          margin: "20px auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Detect
        </button>
      </form>

      {detectedObjects.length > 0 && (
        <div>
          <h2>Detected Objects:</h2>
          <ul>
            {detectedObjects.map((object, index) => (
              <li key={index}>{object}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
