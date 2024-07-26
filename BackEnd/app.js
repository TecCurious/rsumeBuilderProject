let express = require("express");
let app = express();
const path = require('path');
//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
var html = fs.readFileSync("template.html", "utf8");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));


var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<h1 style="text-align: center;">Resume</h1>'
    },
    // body: {
    //     contents: 
    // },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};


// user data
let user = [
    // {
    //   name: "Prakash Kumar",
    //   number: "7011963308",
    //   email: "prakash@123gmail.com",
    //   Address: "d-111 bs road industrial area ghaziabad",
    //   HiColification: "BCA",
    //   experience: "worked as a web developer intern at MangosOrnage pvt ltd.",
    //   skill: "HTML || CSS | JAVASCRIPT"

    // },
 
  ];

  var document = {
    html: html,
    data: {
      users: user,
    },
    path: "./resume.pdf",
    type: "",
  };


  app.get("/home", (req, res)=>{
        res.render("index.ejs");
  })

app.post("/resume", async(req, res)=>{
    console.log(req.body.users);
    user.push(req.body.users);
    await pdf.create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  })
    res.send("resume bulild");

})



app.get("/download", (req, res)=>{
    const filePath = path.resolve(__dirname, './resume.pdf');
    res.sendFile(filePath);
})


app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
})

