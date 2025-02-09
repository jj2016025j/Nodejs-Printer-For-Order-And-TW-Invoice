class InvoiceUtils {
  /**
   * 轉換發票期別（例如：10404 -> 104年03-04月）
   * @param {string} invoicePeriod - 5 碼格式 (如 10404)
   * @returns {string} - 格式化的發票期別 (如 104年03-04月)
   */
  static convertInvoicePeriod(invoicePeriod) {
    if (!this.validateInvoicePeriod(invoicePeriod)) {
      throw new Error("❌ 發票期別格式不正確，應為 5 碼數字 (如 10404)");
    }

    const year = parseInt(invoicePeriod.substring(0, 3), 10);  // 取前三碼為「民國年」
    const month = parseInt(invoicePeriod.substring(3), 10);   // 取後兩碼為「月份」

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      console.error("❌ 發票月份數值無效，應介於 01-12");
      return "無效月份";
    }

    // **使用陣列對應發票期別**
    const invoicePeriods = [
      "01-02", "01-02",  // 1, 2 月
      "03-04", "03-04",  // 3, 4 月
      "05-06", "05-06",  // 5, 6 月
      "07-08", "07-08",  // 7, 8 月
      "09-10", "09-10",  // 9, 10 月
      "11-12", "11-12"   // 11, 12 月
    ];

    return `${year}年${invoicePeriods[month - 1]}月`;
  }

  /**
   * 驗證發票期別格式是否正確
   * @param {string} invoicePeriod
   * @returns {boolean}
   */
  static validateInvoicePeriod(invoicePeriod) {
    return /^[0-9]{5}$/.test(invoicePeriod);
  }

  /**
   * 格式化發票日期（YYYY-MM-DD）
   * @param {string} dateTime - 日期字串 (如 2024-03-18 11:22:33)
   * @returns {string} - 格式化後的日期 (YYYY-MM-DD)
   */
  static formatInvoiceDate(dateTime) {
    if (!dateTime) {
      console.error("錯誤: 日期時間為空");
      return "無效日期";
    }

    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      console.error("錯誤: 無效的日期格式");
      return "無效日期";
    }

    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  /**
   * 格式化對齊文本，確保左側與右側文本間距對齊
   * @param {string} left - 左側文本
   * @param {string} right - 右側文本
   * @param {number} length - 總長度
   * @returns {string} - 調整對齊後的文本
   */
  static fillSpaces(left, right, length) {
    if (!left || !right) {
      console.error("錯誤: 參數不可為空");
      return left + " " + right;
    }

    const totalLength = left.length + right.length;
    if (totalLength >= length) return left + " " + right;

    const spaces = length - totalLength;
    return left + " ".repeat(spaces) + right;
  }

  /**
   * 格式化商品資訊為表格形式
   * @param {Array} items
   * @returns {string}
   */
  static formatInvoiceItems(items) {
    let output = '名稱      數量  單價  總金額\n';

    items.forEach(item => {
      const name = this.calculatePadding(item.name, 12);
      const quantity = this.calculatePadding(item.quantity.toString(), 4);
      const unitPrice = this.calculatePadding(item.unitPrice.toString(), 8);
      const totalPrice = item.totalPrice.toString();

      output += `${name}${quantity}${unitPrice}${totalPrice}\n`;
    });

    return output;
  }
  
    /**
     * 計算對齊填充的函式
     * @param {string} text
     * @param {number} targetWidth
     * @returns {string}
     */
    static calculatePadding(text, targetWidth) {
      const chineseCharCount = text.replace(/[\x00-\xff]/g, "").length;
      const otherCharCount = text.length - chineseCharCount;
      const totalLength = chineseCharCount * 2 + otherCharCount;
      return text.padEnd(targetWidth + (text.length - totalLength), ' ');
  }
}

module.exports = InvoiceUtils;
