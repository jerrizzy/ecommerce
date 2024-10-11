import jsonServer from 'json-server'; // Use import instead of require
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Your db.json file path
const middlewares = jsonServer.defaults();

// Use default middlewares (like logger, static, etc.)
server.use(middlewares);

// Custom CORS middleware to allow specific origin and credentials
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');  // Your frontend URL
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');  // To allow cookies/sessions
    next();
});

// Use the router
server.use(router);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
