# Nodejs-Printer-For-Order-And-TW-Invoice
 
這是一個node.js的打印機操作腳本
主要有三個功能
打印訂單桌號QRCODE
打印訂單內容
打印台灣的電子發票

只要輸入 node app.js 就可以使用

除錯方式:

要把escpos庫裡面index.js出錯的程式碼刪掉
on(d開頭的)

安裝zadig
應該是這個
https://zadig.akeo.ie/
打開執行檔
選擇options
選擇All List Devices
通常會自動幫你選擇已經安裝的打印機
如果沒有就選擇對應的打印機選項
安裝winUSB驅動
裝完就可以了

編碼要用Big5
以下這些都會出亂碼:
GB18030 UTF-8
