from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
import requests
import json

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
        listings_data = []

        for listing in listings:
            listing_data = {}
            div1 = listing.find('div')
            Div2 = div1.find('div')
            info = Div2.find('div', class_='listingInfo')
            conInfo = info.find('div',class_ ='conListingInfo')
            print("coninfo found \n")
            script = conInfo.find('script', type='application/ld+json')
            if script:
                # Extract the JSON content
                print("script found")
                json_text = script.string
                if json_text:
                    try:
                        # Parse the JSON content
                        json_data = json.loads(json_text)
                        print(json.dumps(json_data, indent=4))  # Pretty print JSON data
                        listings_data.append(json_data)
                        
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON: {e}")
                        return None
                else:
                    print("Script tag is empty.")
                    return None
            else:
                print("Script tag with type 'application/ld+json' not found.")
                return None
        

        with open('listings.json', 'w') as json_file:
            json.dump(listings_data, json_file, indent=4)
            print("Data successfully scraped and saved to listings.json")
            return listings_data
            #get address here
    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")



app = Flask(__name__)
@app.route('/api_scrape', methods=['GET'])

def api_scrape():
    input_search = request.args.get('q')
    if not input_search:
        return jsonify({"error": "Please provide a search query (q parameter)."}), 400

    try:
        scraped_data = scrape_posts(input_search)
        return jsonify(scraped_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
#test call
#scrape_posts("San Francisco")
'''
            address_tag = conInfo.find('div', class_='address')
            if address_tag:
                address = address_tag.find('span', class_ = 'address')
                spans = address.find_all('span')
                span_texts = [span.get_text(strip=True) for span in spans]
                listing_data['address'] = ' '.join(span_texts)
            
            #get whole property price here
            price_tag = conInfo.find('div', class_= 'savePrice')
            if price_tag:
                div1 = price_tag.find('span', class_= 'tdprice')
                if div1:
                    price = div1.find('strong')
                    if price:
                        price_num = price.get_text(strip = True)
                        #print('price', price_num)
                        listing_data['price'] = price_num
                    else:
                        listing_data['price'] = 'price not listed'
                else:
                    listing_data['price'] = 'price not listed'
            else:
                listing_data['price'] = 'price not listed'

            #rental value and link to paid info
            rental_price_tag = info.find('div', class_= 'contViewDetails text-end d-none d-sm-block')
            if rental_price_tag:
                div1 = rental_price_tag.find('div', class_= 'rentEstimate')
                rental_price = div1.get_text(strip = True)
                listing_data['rental value'] = rental_price


                div2 = rental_price_tag.find('div', class_= 'contViewDetailsBtn')
                link = div2.find('a')
                link_contents = 'https://www.taxliens.com' + link['href']
                listing_data['See Details Link'] = link_contents
                
                #print('link:', link_contents)
                #print('rental price: ', rental_price)

            #description and sqftage
            description_tag = info.find('div', class_= 'bedbathsizetype d-none d-sm-block')
            if description_tag:
                bedroom_div = description_tag.find('div', class_='fl bedroomsbox')
                bathroom_div = description_tag.find('div', class_='fl barhroomsbox')
                size_div = description_tag.find('div', class_='fl sizebox d-none d-sm-block')

                # Extracting text from the elements here
                bedroom_text = bedroom_div.get_text(strip=True) if bedroom_div else ''
                if bedroom_text == "":
                    bedroom_text = "beds"
                bathroom_text = bathroom_div.get_text(strip=True) if bathroom_div else ''
                if bathroom_text == "":
                    bathroom_text = "baths"
                size_text = size_div.get_text(strip=True).replace(',', '') if size_div else ''
                if size_text == "":
                    size_text = "square footage not yet listed"

                desc = f"{bedroom_text}, {bathroom_text}, {size_text}"
                #print(desc)
                listing_data['Description'] = desc

            #saving image
            image_tag = Div2.find('div', class_= 'tdListingPhoto fl')
            if image_tag:
                #print('tdlisting photo div found:')
                div1 = image_tag.find('div', class_= 'conListingPhoto')
                #print('con listingphoto found')
                photo = div1.find('img')
                #print('pic found')
                if photo and 'src' in photo.attrs:
                    img_src = photo['src']
                    
                    # modify url if necessary, since it needs the http
                    if img_src.startswith('//'):
                        img_src = 'http:' + img_src
                        #print(img_src)
                        listing_data['Photograph'] = img_src

            listings_data.append(listing_data) #add in entries at the end of each lop
            

        with open('listings.json', 'w') as json_file:
            json.dump(listings_data, json_file, indent=4)

        print("Data successfully scraped and saved to listings.json")
    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")



'''

'''


'''