var printer = require("thermal-printer");
// console.log(printer);

printer.init({
  type: 'epson',
  // interface: '/dev/usb/lp0'
  interface: 'USB003'
});
printer.alignCenter();
printer.println("Hello world");
printer.printImage('../img/test.png', function(done){
  printer.cut();
  printer.execute(function(err){
    if (err) {
      console.error("Print failed", err);
    } else {
     console.log("Print done");
    }
  });
});
// npm install thermal-printer