# ecommerce
This is an e-commerce site

# Technologies Used
-React
-JavaScript
-Vanilla CSS
-Shopify API
-Express

Note that you will need a Shopify API key to run a local copy. This requires a Shopify account. Shopify provides account for testing purposes.

After securing the API token key, create a file named .env within the server/ directory, and add your key as follows.

//  /server/.env

SHOPIFY_TOKEN_ACCESS='your token here'

To set up the server, you need to first install npm package => npm install in the server/ directory
Then install express by:
npm install express dotenv node-fetch

- express: The main framework to serve routes and handle requests.
- dotenv: To load environment variables from a .env file.
- node-fetch: To make HTTP requests to Shopify's API.

Next, initialize the express server:
node server.js

To fire off the front-end setup In the client/ directory execute the following:
npm run dev
Open the site by following the URL in your terminal.
