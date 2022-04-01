import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 3000;
const __dirname = path.resolve();

// Storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    let stem = path.basename(file.originalname);
    stem = stem.substring(0, stem.lastIndexOf('.'));
    cb(null, stem + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes

app.post(
  '/upload-profile-pic',
  upload.single('profile_pic'),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      res.status(400).send('Error! No file uploaded');
    }
    const url = 'uploads/' + req.file.filename;
    res.send(
      `<head><link rel="stylesheet" href="styles.css" /></head><h2>Here is the picture:</h2>
      <img src="${url}" alt=${url}/>
      <pre>${JSON.stringify(req.file, null, 2)}</pre>`
    );
  }
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', (req, res) => {
  res.sendFile(__dirname + '/styles.css');
});

app.get('/uploads/:name', (req, res) => {
  const url = __dirname + '/uploads/' + req.params.name;
  res.sendFile(url);
});

// Start server

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
