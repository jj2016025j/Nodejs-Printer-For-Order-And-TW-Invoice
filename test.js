

// 定義一個函數來格式化日期時間
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 使用自定義函數格式化當前時間
const formattedDateTime = formatDateTime(new Date());

// 將格式化後的時間輸出到控制台
console.log(formattedDateTime);