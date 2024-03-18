// 使用終端機指令的方法
// npm install child_process
const { exec } = require('child_process');

// // 在Linux上列出USB設備
// exec('lsusb', (err, stdout, stderr) => {
//     if (err) {
//         console.error(`exec error: ${err}`);
//         return;
//     }
//     console.log(stdout);
// });

// // 在macOS上獲取系統報告
// exec('system_profiler SPUSBDataType', (err, stdout, stderr) => {
//     if (err) {
//         console.error(`exec error: ${err}`);
//         return;
//     }
//     console.log(stdout);
// });

// 在Windows上列出USB设备
exec('wmic path Win32_USBControllerDevice get Dependent', (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }
    console.log(stdout);
});

// 使用PowerShell在Windows上列出USB设备
exec('powershell "Get-PnpDevice -PresentOnly | Where-Object { $_.Class -eq \'USB\' } | Format-Table -AutoSize"', (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }
    console.log(stdout);
});