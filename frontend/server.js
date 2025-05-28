import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from the src directory
app.use(express.static(join(__dirname, 'src'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
}); 