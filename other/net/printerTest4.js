(async function (){
  const  ThermalPrinter  = require("node-thermal-printer").printer;
  const { PrinterTypes } = require("node-thermal-printer");

  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "tcp://xxx.xxx.xxx.xxx"
  });
  const isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);
  printer.alignCenter();
  printer.println("Hello world");
  await printer.printImage("../img/test.png");
  printer.cut();

  try {
    let execute = printer.execute();
    console.log("Print done!");
  } catch (error) {
    console.error("Print failed:", error);
  }
})()

// const ThermalPrinter = require("node-thermal-printer").printer;
// const PrinterTypes = require("node-thermal-printer").types;

// let printer = new ThermalPrinter({
//   type: PrinterTypes.EPSON,
//   interface: 'tcp://xxx.xxx.xxx.xxx'
// });

// printer.alignCenter();
// printer.println("Hello world");
// await printer.printImage('./assets/olaii-logo-black.png')
// printer.cut();

// try {
//   let execute = printer.execute()
//   console.log("Print done!");
// } catch (error) {
//   console.error("Print failed:", error);
// }