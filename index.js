const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mailRoutes = require('./routes/mailRoutes');
const contactRoute = require('./routes/contact');
const loanApplyRoute = require('./routes/loanApply');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', mailRoutes);
app.use('/contact', contactRoute);
app.use('/loanApply', loanApplyRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
