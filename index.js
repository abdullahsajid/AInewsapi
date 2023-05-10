const express = require("express")
const cheerio = require("cheerio")
const axios = require("axios")
const PORT = process.env.PORT || 4000
const app = express()
const store = []
const allNewsWeb = [
    {
        name: "telegraph",
        url: "https://www.telegraph.co.uk/technology",
        mainUrl: "https://www.telegraph.co.uk"
    },
    {
        name: "theguardian",
        url: "https://www.theguardian.com/uk/technology",
        mainUrl : ""
    }
]


allNewsWeb.forEach( async (alldata)  => {
    const response = await axios.get(alldata.url)
    const html = await response.data
    const $ = cheerio.load(html)
    $('a:contains("AI")',html).each(function (){
        const title = $(this).text()
        const url = $(this).attr("href")
        store.push({
            title,
            url : alldata.mainUrl + url,
            newsChannel: alldata.name         
        })
    })
})

app.get("/",(req,res)=>{
    res.send("AI news api")
})

app.get("/ai",async (req,res) => {
    res.json(store)
    
})

app.get("/ainews/:newsId", async (req,res) => {
    const perLinkstore = []
    const newsName = req.params.newsId
    const newsAddress = allNewsWeb.filter((news) => news.name == newsName)[0].url
    const mainurl = allNewsWeb.filter((url) => url.name == newsName)[0].mainUrl
    const response = await axios.get(newsAddress)
    const html = await response.data
    const $ = cheerio.load(html)
    $('a:contains("AI")',html).each(function (){
        const title = $(this).text()
        const url = $(this).attr("href")
        perLinkstore.push({
            title,
            url : mainurl + url,
            newsChannel : newsName
        })
    })
    res.json(perLinkstore)
})

app.listen(PORT,() => {
    console.log(`Server is running successfully on Port :${PORT}`)
})

