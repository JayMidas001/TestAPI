// keepServerAlive.js

const http = require('http');

const keepServerAlive = () => {
    setInterval(() => {
        http.get('https://testapi-c8ay.onrender.com/'); // Change to your server's actual URL if deployed
        console.log("Pinging the server to keep it alive");
    }, 300000); // Ping every 5 minutes (300,000 milliseconds)
};

module.exports = keepServerAlive;
