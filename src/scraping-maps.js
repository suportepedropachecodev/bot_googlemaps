const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fastcsv = require('fast-csv');
const fs = require('fs');



const busca = 'mecanico'
const urlalvo = `https://www.google.com.br/maps/search/${busca}`;

const ws = fs.createWriteStream(`${busca}.csv`)

let dados = [];

async function scrapbot(){
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
    });
    const page = await browser.newPage();
    await page.goto(urlalvo);

    await page.waitForSelector('.tuPVDR7ouq5__start-icon');
    await page.click('.tuPVDR7ouq5__start-icon');
    await page.waitForSelector('div:nth-child(2) > input[type=radio]');
    await page.click('div:nth-child(2) > input[type=radio]');
    await page.waitForSelector('div:nth-child(3) > button:nth-child(2)');
    await page.click('div:nth-child(3) > button:nth-child(2)');

    await page.waitForTimeout(50000);
    
    
    let html = await page.content();
    const $ = await cheerio.load(html);
    $('.section-result-text-content')
    .map((index, element)=>{
        let titulo = $(element).find('.section-result-title').text();
        let tipo = $(element).find('.section-result-details').text();
        let endereco = $(element[1]).find('.section-result-location').text();
        let abertoate = $(element).find('.section-result-opening-hours').text();
        let telefone = $(element).find('.section-result-phone-number').text();

        const dado = {titulo, tipo, endereco, abertoate, telefone};
        dados.push(dado)

    })
    
    console.log(dados);
    fastcsv
    .write(dados, {headers:true})
    .pipe(ws);
    
    //await browser.close();

};

scrapbot();


