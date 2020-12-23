const {Builder, By} = require('selenium-webdriver');

(async function myFunction() {
    try {
        let driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://www.lazada.vn/');
        let j_closeBtn = await driver.findElements(By.className('J_Close'));
        for(let i = 0; i < j_closeBtn.length; i++) {
            await j_closeBtn[i].click();
        }
        
        driver.executeScript("let a = document.getElementsByClassName('hp-mod-card card-bottom-banner J_CardBottomBanner'); for(let i = 0; i < a.length; i++){ a[i].remove();}");
        driver.executeScript("let a = document.getElementsByClassName('lzd-header-banner'); for(let i = 0; i < a.length; i++){ a[i].remove();}");
        driver.executeScript("let a = document.getElementsByClassName('J_MuiSlider card-banner-slider-list'); for(let i = 0; i < a.length; i++){ a[i].remove();}");
    } catch(e) {

    }
})();
  