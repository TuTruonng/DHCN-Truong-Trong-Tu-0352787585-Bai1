const express = require("express");
const dngRoutes = require("./routes/students");
const bodyParser = require("body-parser");
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/students", dngRoutes);
app.set('view engine', 'ejs');

app.get('/',async function(req, res) {
  const rootUrl = `http://${req.get('host')}`;
  var data=await axios.get(`${rootUrl}/api/students/getall`);
  //console.log(data.data.Items);
  res.render('index.ejs',{
    Datatbl : data.data.Items,
    rurl: rootUrl
  });
});

// const singleUpload = upload.single("image");

// app.post("/image-upload", function(req, res) {
//   singleUpload(req, res, function(err, some) {
//     if (err) {
//       return res.status(422).send({
//         errors: [{ title: "Image Upload Error", detail: err.message }]
//       });
//     }
//     return res.json({ imageUrl: req.file.location });
//   });
// });


app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
