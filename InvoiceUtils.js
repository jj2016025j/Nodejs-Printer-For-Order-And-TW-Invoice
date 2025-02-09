class InvoiceUtils {
  /**
   * 轉換發票期別（例如：10404 -> 104年03-04月）
   * @param {string} invoicePeriod - 4 碼格式 (如 10404)
   * @returns {string} - 格式化的發票期別 (如 104年03-04月)
   */
  static convertInvoicePeriod(invoicePeriod) {
    if (!invoicePeriod || invoicePeriod.length !== 5) {
      console.error("錯誤: 發票期別格式不正確");
      return "格式錯誤";
    }

    const year = parseInt(invoicePeriod.substring(0, 3), 10);
    const period = parseInt(invoicePeriod.substring(3), 10);

    if (isNaN(year) || isNaN(period) || period < 1 || period > 6) {
      console.error("錯誤: 發票期別數值無效");
      return "無效期別";
    }

    const startMonth = (period - 1) * 2 + 1;
    const endMonth = startMonth + 1;

    return `${year}年${startMonth.toString().padStart(2, '0')}-${endMonth.toString().padStart(2, '0')}月`;
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
}

module.exports = InvoiceUtils;
