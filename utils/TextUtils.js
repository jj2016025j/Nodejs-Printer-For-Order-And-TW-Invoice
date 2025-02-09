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
  }
  
  module.exports = TextUtils;
  