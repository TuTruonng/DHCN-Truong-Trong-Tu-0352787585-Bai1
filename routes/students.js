const router = require("express").Router();
var AWS = require("aws-sdk");
const uid = require('uuid');
require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { access } = require("fs");
const { Console } = require("console");

AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

const tableName = 'dngStudents';
const bucketName = 'baitapgiuaky';
const bucketUrl = 'https://image-excersise.s3.ap-southeast-1.amazonaws.com/avatar2.jfif?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIhAIipMlYY5aTaYbduBsLq0ISxDNkimlLL5oPdZ%2FSlDHB0AiAF4GGgwediwUYhnw5FSfaSAzcsQg0ttRpmTN%2B5ieDmcirNAgjO%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDczOTI3Nzc3NzQxNSIMkxa1fsljXkueWM9LKqECTlPsdOF7i6xIvChoS7863cuWijw%2BQXRJBU%2FT%2F5FIl23yEFuBx7Tyx9qYmmc6UgYByMJMwEo3za6yaRGoKtNYUkc4nlA7TXAJNUMNEUtV1IxM7aEMuq0M6SSRGUpaw%2BcN1dbEo1FzO6T660G%2B99RnXtuK0kc1bkan6cpBCaXSJ2BlarLdfQGhwmNM14jLEP8ToVTt0bvvgZ55r50oY7JP3VzRqYN%2FuKOdqsdVmjK7D0DwRqHo%2FHwBF%2BwVA0JIJhobJxu8Ao6LaqIP2OXJ%2FXZXZDe6jP30RCLgsrHfVb%2Bk0QdZMtKtnsT8sm7R%2Bah680IXuiPy0GZrhKz2uihvWild5Brvakjr21TB%2FmNBIi%2BcgRYzr5wIAAo5jQO9nPToYH%2FjlTDV5dP8BTqwAlGohY3WwfHZcOBOdn0T6E9lSUF%2BCsG5imNinctW4hfY5EugcQoiXwPQj83nT6vxLA3vNA0WCKkD27Mjfk%2FPvLI3lb0s22iMY7bFYDjs%2BBeeGN%2B%2BmjuSZmzNjOKAFZ8j2BYjY1hlVrUrrddnS4qniFYLMsn9KsvxK1RODtzbMqJiUwNow0bVD17mr4bELl6AEssyGHn4vjkfm4M0RkPDtSoFBcRyb1ziXNPrpHWTb%2FTmEXczJwoUMAT46fUXB4fMrx%2BAFA7em2lgtCAefMZ%2BgVRq2nEFFlOs7e%2BpzxhpkPpxSDqHA62%2BeqzmuD9uBxGicJd91fLgOawg5hIFJph6ri87SrnagZURuIEf6bwHAQ6WO2MTskFvWGH27ypyHoozT%2F1rMS9e6CmGo1SodMBlogQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20201025T052459Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2YIDDVID7734XVGP%2F20201025%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=61d4a0c968751c4bd6eac5eca09373b8f5041424416a09d72581a910020de0c5/';
const s3 = new AWS.S3();

let docClient = new AWS.DynamoDB.DocumentClient();

//Upload images
// router.post('/images', async(req,res)=>{
//   multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: 'image-excersise',
//       acl: 'public-read',
//       metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//       },
//       key: function (req, file, cb) {
//         cb(null, file.originalname)
//       },
//       rename: function (fieldname, filename) {
//         return filename.replace(/\W+/g, '-').toLowerCase();
//       }
//     })
//   })
// })
  
//Get all
router.get("/getall", async (req, res) => {
  var params = {
    TableName: tableName,
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(
        data
      );
    }
  });
});

//Get with id
router.get("/getonce/:id", async (req, res) => {
  var params = {
    TableName: tableName,
    Key: {
      id: req.params.id
    },
  };
  docClient.get(params, function (err, data) {
    if (err) {
      res.send("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
    } else {
      res.send(
        "users::fetchOneByKey::success - " + JSON.stringify(data, null, 2)
      );
    }
  });
});

//Create Students
router.post("/create", async (req, res) => {
  //console.log(req.body);
  var oid = uid.v4()
  // s3.putObject({
  //   Body: "", 
  //   Bucket: bucketName, 
  //   ContentType: 'image/jpeg',
  //   Key: `${oid}.jpg`
  // }, (err, data)=> {
  //   if(err)
  //     console.log('Error' + JSON.stringify(err, null, 2));
  //   else
  //     console.log(data)
  // });
  var dngStudent = {
    'stname':req.body.stname,
    'avatar':`${bucketUrl}${oid}.jpg`,
    'id':oid,
    'mssv':req.body.mssv,
    'birth':req.body.birth
  };

  var params = {
      TableName: tableName,
      Item:  dngStudent
  };

  docClient.put(params, function (err, data) {

      if (err) {
          res.send("users::save::error - " + JSON.stringify(err, null, 2));                      
      } else {
          //res.send("users::save::success" );    
          res.redirect('http://localhost:3000');                  
      }
  });
  // res.send("users::save::success" ); 
});

//Update Student
router.post("/update", async (req, res) => {

  var params = {
    TableName: tableName,
    Key: { "id": req.body.id },
    UpdateExpression: "set stname=:n,avatar=:a,mssv=:ms,birth=:b",
    ExpressionAttributeValues: {
      ':n':req.body.stname,
      ':a':req.body.avatar,
      ':ms':req.body.mssv,
      ':b':req.body.birth
    },
    ReturnValues: "UPDATED_NEW"
  };

  docClient.update(params, function (err, data) {
      if (err) {
          res.send("users::save::error - " + JSON.stringify(err, null, 2));                      
      } else {
          //res.send("users::save::success" ); 
          res.redirect('http://localhost:3000');                        
      }
  });
});

//Delete Student
router.get("/delete/:id", async (req, res) => {
  var params = {
    TableName: tableName,
    Key: {
        "id": req.params.id
    }
  };

  docClient.delete(params, function (err, data) {

      if (err) {
        res.send("users::delete::error - " + JSON.stringify(err, null, 2));
      } else {
          //res.send("users::delete::success");
          res.redirect('http://localhost:3000');   
      }
  });
});

module.exports = router;
