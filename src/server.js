const app = require('./app');
const config = require('dotenv').config()
const cors = require('cors');

const PORT = 3000;

app.use(
    cors({
      origin: process.env.ORIGINS.split(","),  // Allow origins listed in .env file
      credentials: true,  // Allow credentials (cookies, etc.)
    })
);  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
