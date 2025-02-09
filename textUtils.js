class TextUtils {
    /**
     * 計算填充長度，確保中英文對齊
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
  }
  
  module.exports = TextUtils;
  