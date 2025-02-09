// 可以找到所有設備  但後面對設備進行操作會有權限問題
// node 02list-usb.js
// 裝了驅動還是有連線問題

const usb = require('usb');

const devices = usb.getDeviceList();
// devices.forEach(device => {
//   // console.log(device);
// });

devices.forEach(device => {
  device.open();
  device.getStringDescriptor(device.deviceDescriptor.iManufacturer, (error, manufacturer) => {
    if (error) {
      console.log(error);
      return;
    }
    device.getStringDescriptor(device.deviceDescriptor.iProduct, (error, product) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log(`Manufacturer: ${manufacturer}, Product: ${product}`);
      device.close();
    });
  });
});
