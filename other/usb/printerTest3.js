const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
// const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;
console.log("process");

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'USB001',
  // driver: require(electron ? 'electron-printer' : 'printer')
});
console.log("printer");

printer.println("Hello World");
printer.cut();
console.log("async");

(async function(){
  try {
    let result = await printer.execute(); // 假设这里返回一个Promise
    console.log(result); // 如果执行成功，打印结果
  } catch (err) {
    console.error("Print failed", err); // 如果有错误，捕获并打印错误信息
  }
})();


const printer2 = require("printer");

// 列出所有打印機
console.log(printer2.getPrinters());