import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [item, setItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breedInfo, setBreedInfo] = useState(null);

  const fetchRandomItem = async () => {
    setLoading(true);
    setError(null);

    while (true) {
      try {
        // Fetch a random cat image
        const imageResponse = await axios.get("https://api.thecatapi.com/v1/images/search", {
          headers: {
            "x-api-key": "live_yGFpZCBfrjpqsLax2s0OCbx5JObftySmjWUNrCPXPmPkm2WslbeoyTbm56gv62Yg",
          },
        });
        const data = imageResponse.data[0]; // Get the first cat image from the response

        // Check if the fetched item has breed info
        if (data.breeds && data.breeds.length > 0) {
          const breedId = data.breeds[0].id;

          // Fetch breed information using the breed id
          const breedResponse = await axios.get(`https://api.thecatapi.com/v1/breeds/${breedId}`, {
            headers: {
              "x-api-key": "live_yGFpZCBfrjpqsLax2s0OCbx5JObftySmjWUNrCPXPmPkm2WslbeoyTbm56gv62Yg",
            },
          });
          setBreedInfo(breedResponse.data);
          setItem(data); // Set item only if breed info is available
          break; // Exit the loop since we have a valid cat with breed info
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        break; // Exit the loop on error
      }
    }

    setLoading(false); // Set loading to false after successful fetch
  };

  const addToBanList = (attribute) => {
    setBanList([...banList, attribute]);
  };

  const removeFromBanList = (attribute) => {
    setBanList(banList.filter((item) => item !== attribute));
  };

  const isBanned = (item) => {
    return banList.some((attribute) => item.id === attribute || item.url.includes(attribute));
  };

  useEffect(() => {
    fetchRandomItem(); // Fetch a random item when the component mounts
  }, []);

  return (
    <div className="App">
      <div className="main">
        <h1>Discover Random Cats</h1>
        <button onClick={fetchRandomItem} disabled={loading}>
          {loading ? "Loading..." : "Fetch New Cat"}
        </button>

        {error && <p className="error">{error}</p>}

        {item && (
          <div className="item-container">
            <img className="cats" src={item.url} alt="Random Cat" />
            <h3>Cat ID: {item.id}</h3>
            <button onClick={() => addToBanList(item.id)}>
              Ban This Cat
            </button>

            {breedInfo && (
              <div className="breed-info">
                <h4>Breed Facts:</h4>
                <button onClick={() => addToBanList(breedInfo.name)}>Name: {breedInfo.name}</button>
                <button onClick={() => addToBanList(breedInfo.origin)}>Origin: {breedInfo.origin}</button>
                <button onClick={() => addToBanList(breedInfo.temperament)}>Temperament: {breedInfo.temperament}</button>
                <button onClick={() => addToBanList(breedInfo.life_span)}>Life Span: {breedInfo.life_span} years</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="ban-list">
        <h2>Ban List</h2>
        <ul>
          {banList.map((attribute, index) => (
            <li key={index} onClick={() => removeFromBanList(attribute)} style={{ cursor: 'pointer', color: 'red' }}>
              {attribute}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
