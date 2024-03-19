// 需要打印機測試  成功
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
// 這裡就會找不到打印機了
const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

device.open(function (error) {
  printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    // .text('The quick brown fox jumps over the lazy dog')
    // .text('嘿!成功了!我要測試寬度我要測試寬度')
    // .feed(3)
    // .text('嘿!跳行成功了!')
    // .barcode('1234567', 'EAN8')
    .table(["樺", "Two", "陞"])
    .tableCustom(
      [
        { text:"Left", align:"LEFT", width:0.33, style: 'B' },
        { text:"Center", align:"CENTER", width:0.33},
        { text:"Right", align:"RIGHT", width:0.33 }
      ],
      { encoding: 'cp857', size: [1, 1] } // Optional
    )
    // .qrimage('https://lee871116.ddns.net', function(err){
    //   this.cut();
    .close();
  // });
});