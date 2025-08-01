import React, { useState } from "react";
import axios from "axios";
import products from "./products";

function App() {
  const [userInput, setUserInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleRecommend = async () => {
    setSubmitted(true);
    try {
      console.log("Sending to backend:", { userInput, products });
      const res = await axios.post("http://localhost:5000/recommend", {
        input: userInput,
        products,
      });
      console.log("Response from backend:", res.data);
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setRecommendations([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Product Recommendation System</h2>
      <input
        type="text"
        placeholder="e.g., I want a phone under $500"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={{ padding: "10px", width: "60%" }}
      />
      <button
        onClick={handleRecommend}
        style={{ padding: "10px", marginLeft: "10px" }}
      >
        Get Recommendations
      </button>

      {submitted && (
        <div>
          <h3>Recommended Products:</h3>
          {recommendations.length > 0 ? (
            <ul>
              {recommendations.map((p, index) => (
                <li key={index}>
                  {p.name} — ${p.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;


