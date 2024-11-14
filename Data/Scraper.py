from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
import requests
import json
import os
from dotenv import load_dotenv
import csv
import time
import numpy as np
from fake_useragent import UserAgent

ua = UserAgent()


def scrape_posts(input_search):
    if isinstance(input_search, str):
        input_search = input_search.replace(' ', '+')
    
    url = f'https://www.taxliens.com/listing/search.html?q={input_search}'
    print(url)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers = headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        odd_listings = soup.find_all('div', class_='odd row rowResults')
        even_listings = soup.find_all('div', class_='even row rowResults')
        listings = odd_listings + even_listings
        all_listings_data = []

        for listing in listings:
            listing_data = {}
            
            div1 = listing.find('div')
            Div2 = div1.find('div')
            info = Div2.find('div', class_='listingInfo')
            conInfo = info.find('div',class_ ='conListingInfo')

            try:
                linkdiv1 = conInfo.find('div', class_= 'contViewDetails text-end d-none d-sm-block')
                linkdiv2 = linkdiv1.find('div', class_= 'contViewDetailsBtn')
                href = linkdiv2.find('a')
                link = href.get('href')
                link = f'https://www.taxliens.com{link}'
                listing_data['url'] = link
                #print("link: ", link)
            except AttributeError:
                print("error findin link")

            #finding the type of lien
            try:
                typediv = conInfo.find('div', class_= 'messajeType')
                type = typediv.get_text(strip = True)
                listing_data["type"] = type
                #print("type: ", type)
            except AttributeError:
                listing_data["type"] = "Lien Type Coming Soon"
                print("typediv not found.")

            #finding the price of lien

            try:
                pricediv1 = conInfo.find('div', class_= 'savePrice')
                pricediv2 = pricediv1.find('span', class_= 'tdprice')
                price_strong = pricediv2.find('strong')  # Find the <strong> tag
                price_text = price_strong.get_text(strip=True)  # Extract the text inside <strong> and remove whitespace
                price_number = price_text.replace('$', '').replace(',', '')
                listing_data["price"] = price_number
                #print("price: ", price_number)
            except AttributeError:
                listing_data["price"] = "Estimation Coming Soon"

            #finding addr
            try:
                address_div = conInfo.find('div', class_= 'address')
                address_span = address_div.find('span', class_='address')
                address_spans = address_span.find_all('span')  # Find all <span> elements inside `div`
                address_text = ' '.join(span.get_text(strip=True) for span in address_spans)
                listing_data["address"] = address_text
                #print("address: ", address_text)
            except AttributeError:
                listing_data["address"] = "Address Coming Soon"
                print("addressdiv not found")

            #property info
            
            info_div = conInfo.find('div', class_='bedbathsizetype d-none d-sm-block')
            #if info_div: 
                #print("info incoming")

            try:
                bedroom_div = info_div.find('div', class_='fl bedroomsbox')
                bedrooms = bedroom_div.get_text(strip=True) #.split()[0]  # Get the number only
                if not bedrooms:
                    bedrooms = "Bedrooms Coming Soon"
                listing_data['bedrooms'] = bedrooms # Store as integer
            except AttributeError:
                listing_data['bedrooms'] = "Bedrooms Coming Soon"
        

            # Extract bathrooms
            try:
                bathroom_div = info_div.find('div', class_='fl barhroomsbox')
                bathrooms = bathroom_div.get_text(strip=True) #.split()[0]  # Get the number only
                if not bathrooms:
                    bathrooms = "Bathrooms Coming Soon"
                listing_data['bathrooms'] = bathrooms  # Store as integer
            except AttributeError:
                listing_data['bathrooms'] = "Bathrooms Coming Soon"
        

            # Extract square footage
            try:
                size_div = info_div.find('div', class_='fl sizebox d-none d-sm-block')
                sqft_text = size_div.get_text(strip=True) #.split()[0].replace(',', '')  # Remove commas and get number
                if not sqft_text:
                    sqft_text = "Square Footage Coming Soon"
                listing_data['square footage'] = sqft_text  # Store as integer
            except AttributeError:
                listing_data['square footage'] = "Square Footage Coming Soon"

            # Extract property type
            try:
                ptype_div = info_div.find('div', class_='fl ptypebox')
                property_type = ptype_div.get_text(strip=True)
                if not property_type:
                    property_type = "Property Type Coming Soon"
                listing_data['property type'] = property_type  # Store as string
            except AttributeError:
                listing_data['property type'] = "Property Type Coming Soon"

            # print("bedrooms: ", bedrooms)
            # print("bathrooms: ", bathrooms)
            # print("sq footage: ", sqft_text)
            # print("property type; ", property_type)

            all_listings_data.append(listing_data)
            

        return all_listings_data
            #get address here
    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")



def scrape_protected_content(search_url):
    # Start a session to persist cookies
    load_dotenv()
    session = requests.Session()
    headers = {
        'User-Agent': ua.random,
        'Referer': 'https://www.taxliens.com/login.html',
        'Origin': 'https://www.taxliens.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    username = os.environ.get('LOGIN')
    password = os.environ.get('PASSWORD')
    # Login URL and payload
    login_url = 'https://www.taxliens.com/login.html'
    login_payload = {
        'key': f'{username}',
        'password': f'{password}',
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
        #print(response.content)

        if response.status_code == 200:
            paid_data={}
            soup = BeautifulSoup(response.content, 'html.parser')
            div1 = soup.find('div', class_= 'container mt-4')
            # if div1:
            #     print("div1 found")
            div2 = div1.find('div', class_ = 'row')
            # if div2:
            #     print("div2 found")
            div3 = div2.find('div', class_= 'col-lg-12')
            # if div3:
            #     print("div3 found")
            div4 = div3.find('div', id= 'bootstrap-details')
            # if div4:
            #     print("div4 found")
            div5 = div4.find('div', class_= 'row')
            # if div5:
            #     print("div5 found")
            div6 = div5.find('div', class_= 'col-md-8')
            # if div6:
            #     print("div6 found")
            div7 = div6.find('div', id= 'additional_info')
            # if div7:
            #     print("div7 found")
            div8 = div7.find('ul', class_ = 'list-unstyled attributegroup two-column')
            # if div8:
            #     print("div8 found")
            li_elements = div8.find_all('li')
            for li in li_elements:
                spans = li.find_all('span')
                if len(spans) == 0:
                    continue
                label_text = spans[0].get_text(strip=True)  # First span is the label
                value_text = spans[-1].get_text(strip=True)  # Second span is the value
                paid_data[label_text] = value_text
            return paid_data
        else:
            print(f"Failed to retrieve search page. Status code: {response.status_code}")
    else:
        print(f"Failed to login. Status code: {login_response.status_code}")




# app = Flask(__name__)
# @app.route('/api_scrape', methods=['GET'])


def api_scrape(q):
    try:
        scraped_data = scrape_posts(q)
        for item in scraped_data:
            url = item.get('url')
            if url:
                paid_data =  scrape_protected_content(url)
                time.sleep(np.random.uniform(1,10))
                item.update(paid_data)
            else:
                print("link didnt fire")
        return scraped_data
    except Exception as e:
        return e, 500


def write_to_file(Zip_List, Name):
    fieldnames = ['type', 'price', 'address', 'bedrooms', 'bathrooms', 'square footage', 'property type', 'Day(s) On Site:', 'Trustee Name:', 'Trustee Address:', 'Trustee City:', 'Trustee State:', 'Trustee Zip:', 'Trustee Phone:', 'Court Name:', 'Court Address:']

    all_scraped_data = []
    
    csv_file = f"{Name}.csv"
    with open(csv_file, mode='w', newline='', encoding='utf-8') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for zip in Zip_List:
            data = api_scrape(zip)
            all_scraped_data.extend(data)
            #print(all_scraped_data)
        for item in all_scraped_data:
            #print(item)
            if not item:
                continue
            try:
                filtered_item = {key: item.get(key, '') for key in fieldnames}
                writer.writerow(filtered_item)
            except:
                continue
        with open(f'{Name}scraped_data.json', 'w') as json_file:
            json.dump(all_scraped_data, json_file, indent=4)



AL = [35242, 36117, 36695, 35405, 35758, 36830, 35215, 36116,35401, 36330] #Done
AK = [99654, 99504, 99508, 99507, 99645, 99801, 99709, 99577, 99502, 99705] #Done
AZ = [85142, 82360, 85326, 85364, 85383, 85032, 85281, 85301, 85204, 85308] #Done
AR = [71601, 71602, 71603, 71611, 71612, 71613, 71630, 71631, 71635, 71638] #Done
CA = [90011, 90650, 94565, 92336, 91331, 90044, 92335, 90805, 90250, 90201] #Done
CO = [80134, 80013, 80015, 80016, 80219, 80634, 80504, 80022, 80229, 80525] #Done
CT = ['06902', '06010', '06511', '06516', '06810', '06606', '06457', '06492'] # Done
DE = [19720, 19702, 19709, 19701, 19805, 19901, 19808, 19904, 19966, 19713] #Done
FL = [34787, 34953, 33311, 33411,33024, 33025, 33647, 33023, 33012, 32828] #Done
GA = [30044, 30043, 30024, 30349, 30040, 30052, 30041, 30127, 30281, 30096] #Done
HI = [96706, 96797, 96818, 96744, 96817, 96789, 96819, 96734, 96792, 96816] #Done
ID = [83646, 83301, 83709, 83686, 83642, 83854, 83440, 83401, 83704, 83605] #Done
IL = [60629, 60618, 60632, 60647, 60639, 60804, 60617, 60608, 60625, 60623] #Done
IN = [47906, 46307, 46143, 46227, 46032, 47150, 47130, 47201, 46060, 46037] #Done
IA = [50023, 50613, 52001, 52302, 52402, 52404, 52722, 51503, 52240, 50315] #Done
KS = [66062, 66061, 67401, 66502, 67212, 66048, 67846, 66614, 66212, 67217] #done
KY = [40475, 42101, 41042, 42701, 40601, 40324, 40214, 42301, 40509, 40356] #done
LA = [70726, 70072, 70065, 70769, 70301, 70737, 70816, 71111, 70056, 70810] #done
ME = ['04401', '04240', '04103', '04106', '04901', '04330', '04005', '04210', '04074', '04011'] #done
# MD = [20906, 21234, 20878, 21740, 20874, 21222, 21117, 20904, 20744, 21215]
# write_to_file(MD, "MD")
# MA = ['02301', '02148', '02155', '02360', '02169', '02151', '02124', '01960', '01844', '01841']
# write_to_file(MA, "MA")
# MI = [48197, 48180, 48044, 48228, 48103, 48126, 48187, 48439, 48823, 49201]
# write_to_file(MI, "MI")
# MN = [55044, 55901, 55106, 55124, 55303, 56001, 55304, 55379, 55337, 55112]
# write_to_file(MN, "MN")
# MS = [38654, 39503, 39110, 38655, 39402, 39759, 39401, 39564, 39047, 39042]
# write_to_file(MS, "MS")
# MO = [63376, 65203, 63021, 65807, 63366, 63129, 63301, 63031, 63123, 65201]
# write_to_file(MO, "MO")
# MT = [59901, 59102, 59718, 59101, 59715, 59105, 59405, 59701, 59601, 59801]
# write_to_file(MT, "MT")
# NE = [68516, 68521, 68104, 68116, 68123, 68046, 68022, 68025, 68701, 68801]
# write_to_file(NE, "NE")
# NV = [89108, 89031, 89121, 89110, 89115, 89148, 89052, 89123, 89147, 89117]
# write_to_file(NV, "NV")
# NH = ['03103', '03104', '03038','03301', '03102', '03820', '03060', '03079', '03062', '03054']
# write_to_file(NH, "NH")
# NJ = ['08701', '07305', '07002', '07055', '07087', '08753', '07093', '07047', '07111', '08854']
# write_to_file(NJ, "NJ")
# NM = [87121, 87114, 87120, 87124, 87111, 87105, 87507, 87144, 87031, 87401]
# write_to_file(NM, "NM")
# NY = [11368, 11208, 11385, 11373, 11226, 11236, 10467, 10025, 11207, 10314]
# write_to_file(NY, "NY")
# NC = [27610, 28027, 27587, 28269, 28277, 28078, 27519, 28215, 27406]
# write_to_file(NC, "NC")
# ND = [58103, 58104, 58201, 58078, 58503, 58801, 58701, 58102, 58504, 58601]
# write_to_file(ND, "ND")
# OH = [45011, 43123, 43081, 43026, 44256, 43055, 43130, 44035, 44060, 43068]
# write_to_file(OH, "OH")
# OK = [73099, 74012, 73160, 73013, 73072, 74133, 74055, 73505, 73034, 73012]
# write_to_file(OK, "OK")
# OR = [97229, 97045, 97301, 97124, 97402, 97702, 97206, 97223, 97504, 97007]
# write_to_file(OR, "OR")
# PA = [19124, 19120, 17603, 19111, 19143, 19446, 19134, 19149, 19020, 17601]
# write_to_file(PA, "PA")
# RI = ['02860', '02895', '02909', '02908', '02920', '02864', '02816', '02907', '02904', '02893']
# write_to_file(RI, "RI")
# SC = [29072, 29681, 29445, 29485, 29732, 29483, 29730, 29651, 29588, 29720]
# write_to_file(SC, "SC")
# SD = [57106, 57701, 57103, 57702, 57401, 57108, 57104, 57201, 57006, 57105]
# write_to_file(SD, "SD")
# TN = [37013, 37042, 37211, 37128, 37075, 38401, 37122, 37064, 37167, 37027]
# write_to_file(TN, "TN")

TX = [77494, 77449, 78660, 77084, 77433, 79936, 77573, 79938, 75052, 78245]
write_to_file(TX, "TX")
UT = [84043, 84015, 84096, 84404, 84074, 84041, 84003, 84081, 84790, 84120]
write_to_file(UT, "UT")
VT = ['05401', '05452', '05701', '05403', '05641', '05301', '05446', '05478', '05201', '05468']
write_to_file(VT, 'VT')
VA = [22193, 23464, 22191, 23462, 20147, 23322, 20148, 22407, 22554, 23320]
write_to_file(VA, "VA")

WA = [99301, 98052, 98012, 98682, 98208, 99208, 98391, 98115, 98270, 98034]
write_to_file(WA, "WA")
WV = [26554, 26003, 26508, 26505, 25801, 26101, 26301, 25177, 25404, 25526]
write_to_file(WV, "WV")
WI = [53215, 54601, 53711, 54115, 53511, 53704, 54956, 53209, 54915, 54703]
write_to_file(WI, "WI")
WY = [82001, 82009, 82901, 82604, 82601, 82801, 82718, 82007, 82070, 82501]
write_to_file(WY, "WY")

# # if __name__ == '__main__':
# #     app.run(host='127.0.0.1', debug=True, port=5000)

