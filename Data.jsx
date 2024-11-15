import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = 'San Francisco'; // Or whatever search query you want

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api_scrape?q=${searchQuery}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        localStorage.setItem('scrapedData', JSON.stringify(response.data)); // Save data to local storage
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchQuery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Scraped Data</h1>
      {data.map((item, index) => (
        <div key={index}>
          <h2>{item.address}</h2>
          <p>Price: {item.price}</p>
          <p>Description: {item.Description}</p>
          <p>Rental Value: {item['rental value']}</p>
          <img src={item.Photograph} alt="Property" />
          <a href={item['See Details Link']}>See More Details</a>
        </div>
      ))}
    </div>
  );
};
//const savedData = JSON.parse(localStorage.getItem('scrapedData'));
//for data retrieval later - 
export default DataFetcher;