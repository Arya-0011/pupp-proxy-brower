const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 3000;

const sleep = async function (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds / 1000));
}

// Function to Open the Proxy list page
const getProxyList = async function (params) {
    params.url = params.url || '';

    if (params.url == '')
        return 'Blank URLs not allowed!';

    const browser = await puppeteer.launch({
        headless: params.headless || false,
    });
    const page = await browser.newPage();
    await page.goto(params.url);

    var ipData = {};

    if (params.url.includes('scrapingant.com')) {
        await page.waitForSelector('#proxies-list-loader > table > tbody > tr:nth-child(2)');
        ipData.ip_address = await page.$$eval("#proxies-list-loader > table > tbody > tr:nth-child(2) > td:nth-child(1)", (nodes) => nodes.map((n) => n.innerText)[0]);
        ipData.ip_address_port = await page.$$eval("#proxies-list-loader > table > tbody > tr:nth-child(2) > td:nth-child(2)", (nodes) => nodes.map((n) => n.innerText)[0]);
        ipData.connection_type = await page.$$eval("#proxies-list-loader > table > tbody > tr:nth-child(2) > td:nth-child(3)", (nodes) => nodes.map((n) => n.innerText)[0]);
    }
   
    console.log(ipData.ip_address)

    await browser.close();

    return ipData;
};

const openPageWithProxy = async function (params) {
    const proxyDetails = await getProxyList({ url: 'https://scrapingant.com/free-proxies/', headless: params.headless });

    const browser = await puppeteer.launch({
        headless: params.headless,
        args: ['--proxy-server=' + ((proxyDetails.connection_type == 'SOCKS5') ? 'socks5://' : '') + proxyDetails.ip_address + ':' + proxyDetails.ip_address_port]
    });

    try {
        const page = await browser.newPage();
        page.goto('https://api.ipify.org?format=json');
    } catch (e) {
        console.log(e)
    }

    await sleep(50);
    console.log(proxyDetails);
    return proxyDetails;
};


app.get('/openPageWithProxy', async (req, res) => {
    const output = await openPageWithProxy({ headless: false });

    res.send(JSON.stringify(output));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

