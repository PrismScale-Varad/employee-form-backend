const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file

const PORT = process.env.PORT || 3001;  // Use the port from .env, default to 3001

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
