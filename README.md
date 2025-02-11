# Nodejs-Printer-TW-Invoice

## 📜 Node.js 台灣電子發票與訂單列印模組

這是一個 **Node.js 列印工具**，適用於 **台灣電子發票與訂單內容列印**，支援 **QR Code 列印**，並適用於 ESC/POS 兼容的熱感應式印表機。

---

## 📌 主要功能

- ✅ 列印訂單桌號 QR Code
- ✅ 列印訂單內容
- ✅ 列印台灣電子發票

---

## 🚀 快速開始

### 1️⃣ 安裝與導入模組

目前尚未上架至 npm，可透過 GitHub 直接安裝：

```sh
npm install github:jj2016025j/nodejs-printer-tw-invoice
```

### 2️⃣ 列印測試

可執行以下範例程式碼來測試列印功能，如遇問題請至 issue 反映：

```js
const { TextPrinter } = require("nodejs-printer-tw-invoice");

const printer = new TextPrinter();
printer.printSampleText();
```

---

## 🛠️ 除錯方式

如果發生錯誤，請按照以下步驟排除問題：

### 🔹 修正 escpos 錯誤

若 `escpos` 套件出錯，請手動修改 `escpos` 內的 `index.js`：

1. 找到 `escpos/index.js`
2. 刪除 `on(d開頭的)` 相關程式碼，例如：

```js
usb.on('detach', function(device){ ... });
```

---

## 🖨️ 安裝驅動（Windows）

若印表機無法正常運作，請按照以下步驟安裝 **WinUSB 驅動**：

1. 下載並安裝 **Zadig** 👉 [下載 Zadig](https://zadig.akeo.ie/#google_vignette)
2. 打開 **Zadig**
3. 點選 **Options > All List Devices**
4. 選擇你的印表機（通常會自動偵測）
5. 在驅動選擇 **WinUSB**
6. 點擊 **安裝**
7. 安裝完成後即可使用！

---

## 🌐 文字編碼注意事項

請確保 **列印機使用 `Big5` 編碼**，否則可能會出現亂碼問題。

❌ **以下編碼可能會導致亂碼：**

- `GB18030`
- `UTF-8`

✅ **建議使用 `Big5` 編碼**

---

## 📜 授權

本專案採用 **MIT License**，歡迎自由使用與修改。

---

這個 `README.md` 具有以下優勢：

- **清楚列出功能**
- **優化安裝與執行步驟**
- **格式更清晰**
- **強調編碼與除錯方式**

🚀 *這樣更方便使用者快速上手！*
