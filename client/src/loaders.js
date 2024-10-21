async function userLoader({ request, params }) {
    const res = await fetch('http://localhost:8000/check_session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
     
      })
      .then(resp => {
        if (resp.ok) {
          console.log(resp.json())
          return resp.json()
        } else {
          return {}
        }
      })
    return res
  }
  

  async function productListLoader({ request, params }) {
    const response = await fetch('https://test.myshopify.com/admin/api/2024-04/products.json', {
      headers: {
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
    });
  
    const data = await response.json();
    return data.products;
  }

  
  async function productPageLoader({ request, params }) {
    const res = await fetch(`http://localhost:8000/products/${params.id}`)
      .then(resp => resp.json())
    return res
  }

  

  
  export {
    userLoader, 
    productListLoader,
    productPageLoader,
  }