import requests

# Send request to Flask API
response = requests.get("http://127.0.0.1:5001/api_scrape?q=94507")

# Check if the response is successful
if response.status_code == 200:
    scraped_data = response.json()
    # Save scraped data to a JSON file locally for testing purposes
    with open("scraped_data.json", "w") as f:
        import json
        json.dump(scraped_data, f, indent=4)
    print("Data scraped and saved to scraped_data.json")
else:
    print(f"Error: {response.status_code}, {response.text}")

    