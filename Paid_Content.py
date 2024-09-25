import requests
from bs4 import BeautifulSoup
import json
import os
from dotenv import load_dotenv

def scrape_protected_content(search_url):
    # Start a session to persist cookies
    load_dotenv()
    session = requests.Session()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.taxliens.com/login.html',
        'Origin': 'https://www.taxliens.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    username = os.environ.get('USERNAME')
    password = os.environ.get('PASSWORD')
    # Login URL and payload
    login_url = 'https://www.taxliens.com/login.html'
    login_payload = {
        'key': f'{username}', #'jm811machado@gmail.com'
        'password': f'{password}', #'Ariana424!'
        'referralUrl': 'https://www.taxliens.com/',
        'serviceProviderName': 'fdc',
        'oldLegacyDomainName': 'www.foreclosurefreesearch.com',
        'loginMethod': 'username_password'
    }
    
    # Send login request
    login_response = session.post(login_url, data=login_payload, headers= headers)
    # Check login
    if login_response.status_code == 200:
        print('Logged in successfully!')
        #example url - will be gotten from listings.json links
        response = session.get(search_url, headers=headers)
        
        if response.status_code == 200:
            paid_data={}
            soup = BeautifulSoup(response.content, 'html.parser')
            div1 = soup.find('div', class_= 'container mt-4')
            div2 = div1.find('div', class_ = 'row')
            div3 = div2.find('div', class_= 'col-lg-12')
            div4 = div3.find('div', id= 'bootstrap-details')
            div5 = div4.find('div', class_= 'row')
            div6 = div5.find('div', class_= 'col-md-8')
            #print(div6)
            div7 = div6.find('div', id= 'additional_info')
            #print(div7)
            div8 = div7.find('ul', class_ = 'list-unstyled attributegroup two-column')
            li_elements = div8.find_all('li')
            for li in li_elements:
                spans = li.find_all('span')
                if len(spans) == 0:
                    continue
                label_text = spans[0].get_text(strip=True)  # First span is the label
                value_text = spans[-1].get_text(strip=True)  # Second span is the value
                paid_data[label_text] = value_text
            
            print(paid_data)
            with open('paid.json', 'w') as json_file:
                return (paid_data)
                #json.dump(paid_data, json_file, indent=4)
                print("Data successfully scraped and saved to paid.json")
        else:
            print(f"Failed to retrieve search page. Status code: {response.status_code}")
    else:
        print(f"Failed to login. Status code: {login_response.status_code}")



# ex Usage
with open('scraped_data.json', 'r') as json_file:
    data = json.load(json_file)
    urls = [entry['url'] for entry in data if 'url' in entry]  # Collect URLs

all_paid_data = []  # List to collect data from all URLs
for url in urls:
    print(f"Scraping URL: {url}")
    paid_data = scrape_protected_content(url)
    if paid_data:
        all_paid_data.append(paid_data)  # Append data to the list

# Write all collected data to paid.json
with open('paid.json', 'w') as json_file:
    json.dump(all_paid_data, json_file, indent=4)
    print("All data successfully scraped and saved to paid.json")