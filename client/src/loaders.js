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

  // async function productListLoader({ request, params }) {
  //   const res = await fetch('http://localhost:3000/api/products')
  //     .then(resp => resp.json())
  //   return res
  // }
  async function productListLoader({ request, params }) {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST', // Ensure the method matches the backend route
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading product list:', error);
      throw error;
    }
  }
  
  

  
  async function productPageLoader({ request, params }) {
    const res = await fetch(`http://localhost:3000/api/products/${params.id}`)
      .then(resp => resp.json())
    return res
  }


  async function blogListLoader({ request, params }) {
    const res = await fetch('http://localhost:3000/api/blogs')
      .then(resp => resp.json())
    return res
  }
  
  async function blogCardLoader({ request, params }) {
    const res = await fetch(`http://localhost:3000/api/blogs/${params.id}/articles`)
      .then(resp => resp.json())
    return res
  }

  
  export {
    blogCardLoader,
    userLoader, 
    productListLoader,
    productPageLoader,
    blogListLoader
  }