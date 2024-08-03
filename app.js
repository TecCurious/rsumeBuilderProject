let express = require("express");
let app = express();
const path = require('path');
// pupeteer
let pup = require("puppeteer");
let ejsMate = require("ejs-mate");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);

  

  app.get("/home", (req, res)=>{
        res.render("home.ejs");
  })
  
  app.get("/form",(req,res)=>{
    res.render("form.ejs");
  })

  

// pupetter
// let formData = {}
// app.post("/template", (req, res)=>{
//     formData = req.body.info;
//   res.render("template.ejs", {info: formData});
// })

app.get("/template", (req, res)=>{
  const info = JSON.parse(req.query.info);
  console.log(info);
res.render("template.ejs", {info});
})


// app.use("/template", (req, res)=>{
// res.render("template.ejs");
// })



app.post("/resume", async (req, res) => {
      // let {id} = req.params;
      let {info} = req.body;
      console.log(info);
  try {
    const browser = await pup.launch({ timeout: 0 });
    const page = await browser.newPage();
    

    await page.goto(`${req.protocol}://${req.get('host')}/template?info=${encodeURIComponent(JSON.stringify(info))}`, {
      waitUntil: "networkidle2"
    });

    await page.setViewport({ width: 1600, height: 1050 });

    const todaDate = new Date();
    const pdfFileName = `${todaDate.getTime()}.pdf`;
    const pdfPath = path.join(__dirname, "./public/files", todaDate.getTime() + ".pdf");


    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true
    });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      // "Content-Disposition": `attachment; filename="${todaDate.getTime()}.pdf"`
    });


    res.redirect(`/pdf-generated?pdfName=${pdfFileName}`);
      // if(id == "download"){
      //   res.download(pdfPath);
      // }else {
      //   res.sendFile(pdfPath);
      // }
        
    

  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('An error occurred while generating the PDF.');
  }
});

// after pdf generated
app.get("/pdf-generated", (req, res)=>{
      let {pdfName} = req.query;
      console.log(pdfName);
    res.render("option.ejs", {pdfName});
})

// for preview resume
app.get("/preview/:pdfName", (req, res) => {
  console.log( req.params.pdfName)
  const filePath = path.join(__dirname, "./public/files", req.params.pdfName);  
  res.sendFile(filePath);
})

// for download resume
app.get("/download/:pdfName", (req, res) => {
  console.log( req.params.pdfName)
  const filePath = path.join(__dirname, "./public/files", req.params.pdfName);  
  res.download(filePath);
})



app.use((req, res)=>{
  res.send("Page Not Found");
})

app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
})

