const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new' 
        });
        const page = await browser.newPage();

        // Listen for console messages
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        // Listen for page errors
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

        await page.goto('http://localhost:3000/login');
        console.log('Navigated to login page...');

        // Wait for inputs
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', 'arun@student.edu');
        await page.type('input[type="password"]', 'Student@123');

        // Click submit
        await page.click('button[type="submit"]');
        console.log('Clicked login...');
        
        // Wait for navigation or a small timeout to let requests happen
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const currentUrl = page.url();
        console.log('Current URL after login:', currentUrl);
        
        await browser.close();
    } catch (e) {
        console.error('Puppeteer Script Error:', e);
    }
})();
