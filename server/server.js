import express from 'express';
import fetch from 'node-fetch'; // Needed for making API requests in Node.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for __dirname in ES modules

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv to read .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Custom CORS middleware to allow your React frontend to connect
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Update based on your frontend port
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Route for fetching products from Shopify API
app.get('/api/products', async (req, res) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-04/products.json`;

  try {
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error fetching Shopify products' });
    }

    // Transform the Shopify response to match your mock API structure
    const transformedProducts = data.products.map((product) => {
      return {
        id: product.id, // Shopify's product ID
        name: product.title, // Shopify's product title
        image: product.image ? product.image.src : '', // Shopify product main image URL
        price: product.variants[0]?.price || 0, // Shopify variant price (first variant)
        // Add a check for body_html to avoid calling .replace() on null or undefined
        description: product.body_html ? product.body_html.replace(/(<([^>]+)>)/gi, "") : "No description available", // Strip HTML from description
        brand: product.vendor || '', // Shopify's vendor
        quantity: product.variants[0]?.inventory_quantity || 0, // Shopify's inventory quantity for the first variant
        variant_id: product.variants[0]?.id,  // Ensure the variant_id is passed to the frontend
      };
    });

    res.status(200).json({ products: transformedProducts });
    console.log('Transformed product data:', transformedProducts);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for fetching single product by id
app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;  // Get the product ID from the URL
  const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-04/products/${productId}.json`;

  try {
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error fetching product from Shopify' });
    }

    // Ensure the product exists in the response
    const product = data.product;  // Properly initialize the product variable from the response

    // Transform the product response to match the format you need
    const transformedProduct = {
      id: product.id,
      name: product.title,
      image: product.image ? product.image.src : '',
      price: product.variants[0]?.price || 0,
      description: product.body_html ? product.body_html.replace(/(<([^>]+)>)/gi, "") : "No description available",
      brand: product.vendor,
      quantity: product.variants[0]?.inventory_quantity || 0,
      variant_id: product.variants[0]?.id,  // Ensure the variant_id is passed to the frontend
    };

    res.status(200).json(transformedProduct);  // Send the transformed product data back
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create checkout (cart)
app.post('/api/create-checkout', async (req, res) => {
  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/api/2024-04/checkouts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        checkout: {
          line_items: []  // Initially, an empty checkout
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error from Shopify API:', data);
      return res.status(response.status).json({ error: 'Failed to create checkout' });
    }

    console.log('Checkout object returned from Shopify:', data);  // Debug log to check the response

    // Return the checkout object, including the checkout ID
    res.status(200).json({ token: data.checkout.token });  // Return the checkout token for use in the frontend
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to add items to the checkout
app.put('/api/add-to-cart', async (req, res) => {
  const { checkoutToken, variantId, quantity } = req.body;

  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/api/2024-04/checkouts/${checkoutToken}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,  // Hidden token
      },
      body: JSON.stringify({
        checkout: {
          line_items: [
            {
              variant_id: variantId,
              quantity: quantity,
            }
          ]
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data.checkout);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-04/blogs.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN, // Use Admin API Access Token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error from Shopify API:', data);
      return res.status(response.status).json({ error: 'Failed to fetch blogs' });
    }

    // Return the blogs
    res.status(200).json({ blogs: data.blogs }); // Adjust response to return blogs directly
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/blogs/:blogId/articles', async (req, res) => {
  const { blogId } = req.params;
  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-04/blogs/${blogId}/articles.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Shopify API:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch articles' });
    }

    const data = await response.json();
    res.status(200).json(data.articles); // Send articles directly in the response
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
