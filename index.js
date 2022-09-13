const port = process.env.PORT || 8000; 
const express = require('express'); 
const axios = require('axios'); 
const cheerio = require('cheerio'); 

const app = express(); 
const articles = []; 
const topArticles = []; 
const latestArticles = []; 
const topMonth = []; 
const topYear = []; 
const topInfinity = []; 

app.get('/', (req, res)=>{
    res.json("This is the starting page of Dev.to api")
})


app.get('/articles', (req, res)=>{
    axios.get('https://dev.to/')
        .then((response)=>{
            const html = response.data; 
            const $ = cheerio.load(html); //parsing the html using cheerio and it in turns returns an api to traverse/manipulate the 
            //resulting data strucutre 

            $('.crayons-story > a', html).each(function(){
                const title = $(this).text(); 
                const url = $(this).attr('href'); 
                articles.push({
                    title, 
                    url: 'https://dev.to' + url 
                })
            })
            res.json(articles); 
            
        }).catch((err)=> console.log(err))
})

app.get('/articles/relevant', (req, res)=>{
    res.redirect('/articles'); 
}); 

app.get('/articles/latest', (req, res)=>{
    axios.get('https://dev.to/latest')
        .then((response) =>{
            const html = response.data; 
            const $ = cheerio.load(html); 
            $('.crayons-story > a', html).each(function(){
                const title = $(this).text();
                const url = $(this).attr('href'); 
                latestArticles.push({
                    title, 
                    url: 'https://dev.to' + url
                })
           })
           res.json(latestArticles); 
        }).catch((err)=> console.log(err))
})



app.get('/articles/top', (req, res)=>{
    axios.get('https://dev.to/top/week')
        .then((response)=>{
            // const html = response.data; 
            const html = response.data;
            // console.log(html); 
            const $ = cheerio.load(html); 
            $('.crayons-story > a', html).each(function(){
                const title = $(this).text();
                const url = $(this).attr('href'); 
                topArticles.push({
                    title, 
                    url: 'https://dev.to' + url
                })
            })
            res.json(topArticles); 
        }).catch((err)=> console.log(err))
})

app.get('/articles/top/:Id', (req, res)=>{  //Id can be: weak, month, year, infinity
    const id = req.params.Id; 
    if(id == 'week'){
        res.redirect('/articles/top')
    }
    axios.get('https://dev.to/top/id')
        .then((response)=>{
            // const html = response.data; 
            const html = response.data;
            // console.log(html); 
            const $ = cheerio.load(html); 
            $('.crayons-story > a', html).each(function(){
                const title = $(this).text();
                const url = $(this).attr('href'); 

                if(id == 'month'){
                    topMonth.push({
                    title, 
                    url: 'https://dev.to' + url
                })
                res.json(topMonth); 
                }

                if(id == 'year'){
                    topYear.push({
                    title, 
                    url: 'https://dev.to' + url
                })
                res.json(topYear); 
                }

                if(id == 'infinity'){
                    topInfinity.push({
                    title, 
                    url: 'https://dev.to' + url
                })
                res.json(topInfinity); 
                }              
            })            
        }).catch((err)=> console.log(err))
})



app.listen(port, ()=>{
    console.log(`serving on port ${port}`);
})