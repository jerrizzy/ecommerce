import express from 'express';
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
    const transformedProducts = data.map.products((product) => {
      return {
        id: product.id, // Shopify's product ID
        name: product.title, // Shopify's product title
        image: product.image ? product.image.src : '', // Shopify product main image URL
        price: product.variants[0]?.price || 0, // Shopify variant price (first variant)
        // Add a check for body_html to avoid calling .replace() on null or undefined
        description: product.body_html ? product.body_html.replace(/(<([^>]+)>)/gi, "") : "No description available", // Strip HTML from description
        brand: product.vendor || '', // Shopify's vendor
        quantity: product.variants[0]?.inventory_quantity || 0 // Shopify's inventory quantity for the first variant
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

    // Transform the product response to match the format you need
    const product = {
      id: data.product.id,
      name: data.product.title,
      image: data.product.image ? data.product.image.src : '',
      price: data.product.variants[0]?.price || 0,
      description: data.product.body_html.replace(/(<([^>]+)>)/gi, ""),
      brand: data.product.vendor,
      quantity: data.product.variants[0]?.inventory_quantity || 0,
    };

    res.status(200).json(product);  // Send the transformed product data back
  } catch (error) {
    console.error('Error fetching product:', error);
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
