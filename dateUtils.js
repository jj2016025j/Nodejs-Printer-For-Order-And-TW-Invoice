class DateUtils {
  /**
   * 格式化當前日期時間為 YYYY-MM-DD HH:MM:SS
   * @param {Date} date
   * @returns {string}
   */
  static formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 解析發票日期並加一天，返回 YYYY-MM-DD 格式
   * @param {string} dateTime 發票日期 (YYYY-MM-DD HH:MM:SS)
   * @returns {string}
   */
  static formatInvoiceDate(dateTime) {
    const date = new Date(dateTime);
    date.setDate(date.getDate() + 1);

    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}

module.exports = DateUtils;
