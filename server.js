const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const emailsFile = path.join(dataDir, 'emails.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(emailsFile)) {
  fs.writeFileSync(emailsFile, JSON.stringify({ emails: [] }));
}

const getEmails = () => {
  const data = fs.readFileSync(emailsFile, 'utf8');
  return JSON.parse(data);
};

const saveEmail = (email) => {
  const data = getEmails();
  if (!data.emails.includes(email)) {
    data.emails.push(email);
    fs.writeFileSync(emailsFile, JSON.stringify(data, null, 2));
  }
};

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  saveEmail(email);
  res.json({ success: true, message: 'Email saved successfully' });
});

app.get('/api/emails', (req, res) => {
  const data = getEmails();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
