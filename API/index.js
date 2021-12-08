const fs = require('fs')
const express = require('express')
const port = 5000
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const ndjson = require('ndjson')
const {
  body,
  validationResult
} = require('express-validator');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/arrondissement', [
  [
    body('code', "Entrer un code d'arrondissement")
      .isNumeric()
      .notEmpty()
  ]
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array()
    });
  const code = req.body.code
  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream(__dirname + '/arrondissements.geojson')
    .pipe(ndjson.parse())
    .on('data', data => {
      let dataToReturn = [];
      for (let i = 0; i<data.features.length;i++) {
        if (data.features[i].properties.c_ar === code) {
          dataToReturn.push(data.features[i])
        }
      }
      if (dataToReturn.length > 0) {
        res.status(200).json({
          success: true,
          data: dataToReturn
        })
      } else {
        res.status(404).json({
          success: false,
          err: "Invalid code"
        })
      }
    })
});

app.post('/lieuxTournage', [
  [
    body('code', "Entrer un code d'arrondissement")
      .isNumeric()
      .notEmpty()
  ]
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array()
    });
  let code = "0"
  if (req.body.code.length < 2) {
    code = "7500" + req.body.code
  } else {
    code = "750" + req.body.code
  }

  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream(__dirname + '/lieux-de-tournage-a-paris.geojson')
    .pipe(ndjson.parse())
    .on('data', data => {
      console.log(data.features)
      let dataToReturn = [];
      for (let i = 0; i<data.features.length;i++) {
        if (data.features[i].properties.ardt_lieu === code) {
          dataToReturn.push(data.features[i])
        }
      }
      console.log(dataToReturn)
      if (dataToReturn.length > 0) {
        res.status(200).json({
          success: true,
          data: dataToReturn
        })
      } else {
        res.status(404).json({
          success: false,
          err: "Invalid code"
        })
      }
    })
});

app.get('/lieuxTournages', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream(__dirname + '/lieux-de-tournage-a-paris.geojson')
    .pipe(ndjson.parse())
    .on('data', data => {
      res.status(200).json({success: true, data: data.features})
    })
});

app.get('/arrondissements', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream(__dirname + '/arrondissements.geojson')
    .pipe(ndjson.parse())
    .on('data', data => {
      res.status(200).json({success: true, data: data.features})
    })
});

app.listen(port, () => {
  console.log("started")
})