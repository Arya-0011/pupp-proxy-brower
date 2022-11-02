const puppeteer = require('puppeteer');

// starting Puppeteer

let retry = 0;
let maxRetries = 5;

(async function scrape() {
    const sleep = async function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    
    retry++;

    let proxyList = [
        '217.150.210.20:7497',
        '70.40.254.162:8111',
        '24.252.24.5:8111',
        '197.248.135.115:8111',
        
    ];

    var proxy = proxyList[Math.floor(Math.random() * proxyList.length)];

    console.log('proxy: ' + proxy);

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=socks5://' + proxy]
    });

    try {
        const page = await browser.newPage();
        // page.goto('https://www.google.com/search?q=what+is+my+ip');
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
    } catch (e) {


        if (retry < maxRetries) {
            scrape();
        }
    }

    await sleep(100000000);

    await browser.close();

})();
