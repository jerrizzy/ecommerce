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
  res.header('Access-Control-Allow-Origin', '*'); // Update based on your frontend port
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Route for fetching products from Shopify API
app.post('/api/products', async (req, res) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-04/graphql.json`;

  try {
    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          {
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  description
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        price
                        inventoryQuantity
                        availableForSale
                        image {
                          src
                        }
                      }
                    }
                  }
                  featuredImage {
                    src
                  }
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API error:', data.errors);
      return res.status(400).json({ error: 'Error fetching Shopify products', details: data.errors });
    }

    const products = data.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      image: node.featuredImage ? node.featuredImage.src : '',
      variants: node.variants.edges.map(({ node: variant }) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        inventoryQuantity: variant.inventoryQuantity, // Quantity added
        available: variant.availableForSale,
        image: variant.image ? variant.image.src : '',
      })),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route for fetching single product by id
app.post('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          query getProductById($id: ID!) {
            product(id: $id) {
              id
              title
              description
              featuredImage {
                src
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                    availableForSale
                    image {
                      src
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: `gid://shopify/Product/${productId}`, // Shopify expects a global ID format
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API error:', data.errors);
      return res.status(400).json({
        error: 'Error fetching product details',
        details: data.errors,
      });
    }

    const product = data.data.product;

    // Transform the product data to match the frontend's expected format
    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.featuredImage ? product.featuredImage.src : '',
      variants: product.variants.edges.map(({ node: variant }) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        inventoryQuantity: variant.inventoryQuantity,
        available: variant.availableForSale,
        image: variant.image ? variant.image.src : '',
      })),
    };

    res.status(200).json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create checkout (cart)
app.post('/api/create-checkout', async (req, res) => {
  try {
    // Shopify GraphQL mutation for creating a checkout
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation {
            checkoutCreate(input: { lineItems: [] }) {
              checkout {
                id
                webUrl
                createdAt
                currencyCode
                subtotalPriceV2 {
                  amount
                  currencyCode
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    // Log the full response for debugging
    console.log('Shopify API Response:', JSON.stringify(data, null, 2));

    // Check for errors or userErrors in the response
    if (data.errors || (data.data && data.data.checkoutCreate.userErrors.length > 0)) {
      console.error('Shopify API error:', data.errors || data.data.checkoutCreate.userErrors);
      return res.status(400).json({
        error: 'Failed to create checkout',
        details: data.errors || data.data.checkoutCreate.userErrors,
      });
    }

    // Extract the checkout object
    const checkout = data.data.checkoutCreate.checkout;

    // Respond with the full checkout object
    res.status(200).json({
      token: checkout.id,
      webUrl: checkout.webUrl,
      createdAt: checkout.createdAt,
      currencyCode: checkout.currencyCode,
      subtotalPrice: checkout.subtotalPriceV2.amount,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to add items to the checkout
app.post('/api/add-to-cart', async (req, res) => {
  const { checkoutToken, variantId, quantity } = req.body;

  console.log('Received data:', { checkoutToken, variantId, quantity });

  if (!checkoutToken || !variantId || !quantity) {
    return res.status(400).json({ error: 'Missing required fields: checkoutToken, variantId, or quantity' });
  }

  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
            checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
              checkout {
                id
                webUrl
                lineItems(first: 10) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
                        id
                        price {
                          amount
                          currencyCode
                        }
                        image {
                          src
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          checkoutId: checkoutToken,
          lineItems: [
            {
              variantId,
              quantity,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.checkoutLineItemsAdd.userErrors.length > 0) {
      console.error('Shopify API error:', data.errors || data.data.checkoutLineItemsAdd.userErrors);
      return res.status(400).json({
        error: 'Failed to add item to checkout',
        details: data.errors || data.data.checkoutLineItemsAdd.userErrors,
      });
    }

    const checkout = data.data.checkoutLineItemsAdd.checkout;
    res.status(200).json(checkout);

  } catch (error) {
    console.error('Error adding item to checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//     if (data.errors) {
//       console.error('Shopify API error:', data.errors);
//       return res.status(400).json({ error: 'Failed to add item to checkout' });
//     }

//     res.status(200).json(data.checkout);
//   } catch (error) {
//     console.error('Error adding item to cart:', error);
//     res.status(500).json({ error: 'Failed to add item to cart' });
//   }
// });

app.post('/api/remove-from-cart', async (req, res) => {
  const { checkoutToken, lineItemId } = req.body;

  if (!checkoutToken || !lineItemId) {
    return res.status(400).json({ error: 'Missing required fields: checkoutToken or lineItemId' });
  }

  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation ($checkoutId: ID!, $lineItemIds: [ID!]!) {
            checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
              checkout {
                id
                webUrl
                lineItems(first: 10) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
                        id
                        price {
                          amount
                          currencyCode
                        }
                        image {
                          src
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          checkoutId: checkoutToken,
          lineItemIds: [lineItemId],
        },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.checkoutLineItemsRemove.userErrors.length > 0) {
      console.error('Shopify API error:', data.errors || data.data.checkoutLineItemsRemove.userErrors);
      return res.status(400).json({
        error: 'Failed to remove item from checkout',
        details: data.errors || data.data.checkoutLineItemsRemove.userErrors,
      });
    }

    const checkout = data.data.checkoutLineItemsRemove.checkout;
    res.status(200).json(checkout); // Return the updated checkout object
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/blogs', async (req, res) => {
  try {
    const response = await fetch(`https://${process.env.SHOPIFY_SHOP_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN, // Correct token for Storefront API
      },
      body: JSON.stringify({
        query: `
          {
            blog(handle: "videos") {
              articles(first: 10) {
                edges {
                  node {
                    title
                    contentHtml
                    publishedAt
                    excerpt
                    image {
                      src
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    console.log("raw data:", JSON.stringify(data.data.blog, null, 2));

    if (data.errors) {
      console.error('Error from Shopify API:', data.errors);
      return res.status(400).json({ error: 'Failed to fetch blogs', details: data.errors });
    }

    // Extract articles from the response
    const articles = data.data.blog.articles.edges.map(({ node }) => ({
      title: node.title,
      contentHtml: node.contentHtml,
      publishedAt: node.publishedAt,
      excerpt: node.excerpt,
      imageUrl: node.image ? node.image.src : null,
    }));

    res.status(200).json({ blogs: articles });
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
