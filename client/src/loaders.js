async function userLoader({ request, params }) {
    const res = await fetch('http://127.0.0.1:5555/check_session', {
        method: 'GET',
        credentials: 'include'
      })
      .then(resp => {
        if (resp.ok) {
          return resp.json()
        } else {
          return {}
        }
      })
    return res
  }
  
  
  async function productListLoader({ request, params }) {
    const res = await fetch("http://127.0.0.1:5555/dogs")
      .then(resp => resp.json())
    return res
  }
  
  async function productPageLoader({ request, params }) {
    const res = await fetch(`http://127.0.0.1:5555/dogs/${params.id}`)
      .then(resp => resp.json())
    return res
  }

  async function newProductLoader({ request, params }) {
    // In a real-world application, you'd use request.postBody or request.formData
    // to get the form data. Here, we're just assuming it's a JSON object.
    const formData = JSON.parse(request.postBody)

    const res = await fetch('http://127.0.0.1:5555/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    return res.json()
  }


  
  export {
    userLoader, 
    productListLoader,
    productPageLoader,
    newProductLoader,
  }