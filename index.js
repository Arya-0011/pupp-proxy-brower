const puppeteer = require('puppeteer');

// starting Puppeteer

let retry = 0;
let maxRetries = 5;

(async function scrape() {
    retry++;

    let proxyList = [
        '202.131.234.142:39330',
        '45.235.216.112:8080',
        '129.146.249.135:80',
        '148.251.20.79'
    ];

    var proxy = proxyList[Math.floor(Math.random() * proxyList.length)];

    console.log('proxy: ' + proxy);

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=' + proxy]
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');

        // await browser.close();
    } catch (e) {

        // await browser.close();

        if (retry < maxRetries) {
            scrape();
        }
    }
})();
