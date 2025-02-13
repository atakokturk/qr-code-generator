const express = require("express")
const qr = require("qrcode")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = 3000;

//EJS template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

//static files
app.use(express.static(path.join(__dirname, "views")))
app.use(express.urlencoded({extended:true}))   //express.urlencoded() middleware'i, application/x-www-form-urlencoded formatındaki verileri alır ve req.body nesnesine dönüştürür.{ extended: true } seçeneği, req.body nesnesinin iç içe geçmiş nesneleri (nested objects) desteklemesini sağlar.

app.get("/", (req,res) => {
    res.render("index", {qrCodeUrl : null, error : null})
})

app.post("/generate", async (req,res)=>{
    const {url} = req.body;
    if(!url){
        return res.render('index', { qrCodeUrl: null, error: "Please enter a valid URL!" });
    }
    try {
        const qrCodePath = `views/qrcodes/${Date.now()}.png`
        await qr.toFile(qrCodePath, url, {
        width: 500
    })
        res.render("index", {qrCodeUrl: qrCodePath.replace("views/",""), error:null})
    } catch (err) {
        res.render("index", {qrCodeUrl: null, error: "Error while rendering QR Code"}) 
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})




