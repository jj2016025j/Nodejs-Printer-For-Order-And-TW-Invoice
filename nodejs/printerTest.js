const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
console.log("ThermalPrinter");

let printerTest = new ThermalPrinter({
    type: PrinterTypes.EPSON,   // 即使打印機不是EPSON品牌，也可以設定為EPSON，如果它支持ESC/POS
    interface: 'USB001',  // 本來只有USB001可以不知道為甚麼後面其他也可以了，USB004以上不行
    // driver: require('printer')  // 使用 'printer' 驱动，需要安装 'printer' 模块
});
// console.log(printerTest);


(async function () {
    const isConnected = await printerTest.isPrinterConnected();
    console.log("Printer connected:", isConnected);
    let raw = await printerTest.raw(Buffer.from("Hello world"));    // Print instantly. Returns success or throws error
    console.log("Raw:", raw);
    if (isConnected) {
        // 打印文本
        printerTest.println("Hello, World!");

        // 打印加粗文本
        printerTest.bold(true);
        printerTest.println("Bold text");
        printerTest.bold(false);

        // 打印二维码
        // printerTest.qrCode("https://www.example.com");

        // 尝试其他打印命令...

        // 切割纸张
        printerTest.cut();

        try {
            const execute = await printerTest.execute();
            console.log("Print success.", execute);
        } catch (error) {
            console.error("Print failed:", error);
        }
    } else {
        console.log("Printer not connected");
    }
})();