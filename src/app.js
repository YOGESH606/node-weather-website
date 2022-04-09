const express = require('express')
const path = require('path')
const hbs =require('hbs')
let geocode = require('./utils/geocode');
let forecast = require('./utils/forecast');

const app = express();

//define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

//setup handlebars engine and view location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/',(req,res)=>{
    res.render('index',{
        name:'Yogesh Chavan',
        title:'Weather'
    });
})
app.get('/about',(req,res)=>{
    res.render('about',{
        name:'Yogesh Chavan',
        title:'About'
    });
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title:"Help",
        name:"Yogesh Chavan",
        msg:'help message.',

    });
})

app.get('/weather',(req,res) =>{
    if(!req.query.address){
        return res.send({
            error:"You must provide a address"
        })
    }
    else{
        geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
            if(error){
                res.send({
                    error
                })
            }
            else{
                forecast(latitude,longitude,(error,forecastdata)=>{
                       if(error){
                           console.log(error);
                       }
                       res.send({
                           forecast:forecastdata,
                           location:location,
                           address:req.query.address

                       })
                })
            }
       })
    }
    
 
});

app.get('/products',(req,res) =>{
    if(!req.query.search){
        return res.send({
            error:"You must provide a search term"
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'yogesh chavan',
        errormsg:'page not found'
    })
})
app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'yogesh chavan',
        errormsg:'help article not found'
    })
})
app.listen(3000,()=>{
    console.log('server is up and running ...')
})