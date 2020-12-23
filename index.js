const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

function readDataFromCsv(filename) {
    return new Promise((resolve, reject) => {
        let result = [];
        fs.createReadStream(filename)
            .on("data", (chunk) => {
                let temp = chunk
                    .toString()
                    .split(/[,\r\n]/)
                    .filter((x) => x != "");
                for (let i = 0; i < temp.length; i = i + 2) {
                    result.push({
                        id: temp[i],
                        amount: temp[i + 1],
                    });
                }
            })
            .on("end", () => {
                resolve(result);
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function example() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        //Read data from file
        let data = Array.from(await readDataFromCsv("data.csv"));
        let totalItemsFromFile = 0;

        for (let i = 0; i < data.length; i++) {
            totalItemsFromFile += Number(data[i].amount);
        }

        // Login
        await driver.get("https://member.lazada.vn/user/login");
        await driver.wait(
            until.urlContains("https://member.lazada.vn/user/profile#/")
        );

        //Delete all item in cart if item is existed
        await driver.get("https://cart.lazada.vn/cart");
        let isCartEmpty = await driver.findElements(
            By.className("cart-empty-text")
        );
        if (isCartEmpty.length == 0) {
            await (
                await driver.findElements(
                    By.className("next-checkbox list-header-checkbox")
                )
            )[0].click();
            await (
                await driver.findElements(
                    By.className("btn-wrap automation-btn-delete")
                )
            )[0].click();
            await (await driver.findElements(By.className("ok")))[0].click();
        }

        //Add item from data to cart
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            await driver.get("https://www.lazada.vn/products/" + item.id + ".html");

            if (i == 0)
                await (
                    await driver.findElements(By.className("sfo__close"))
                )[0].click();

            let amountBtn = await driver.findElement(By.css('input[type="text"]'));
            await amountBtn.click();
            await amountBtn.sendKeys(item.amount);

            await (
                await driver.findElements(
                    By.className(
                        "add-to-cart-buy-now-btn pdp-button pdp-button_type_text pdp-button_theme_orange pdp-button_size_xl"
                    )
                )
            )[0].click();
        }

        await driver.get("https://cart.lazada.vn/cart");
        await (
            await driver.findElements(
                By.className("next-checkbox list-header-checkbox")
            )
        )[0].click();

        await sleep(200);

        let itemsAmount = await (
            await driver.findElement(By.id("topActionCartNumber"))
        ).getText();
        let totalPrice = await (
            await driver.findElements(By.className("checkout-order-total-fee"))
        )[0].getText();
        totalPrice = totalPrice.replace("\n", " ");
        console.log("Tong so luong mat hang tu file data: " + totalItemsFromFile);
        console.log("Tong so luong hang trong gio hang: " + itemsAmount);
        console.log("Tong tien: " + totalPrice);
    } catch (e) {
        console.log(e);
    }
})();
