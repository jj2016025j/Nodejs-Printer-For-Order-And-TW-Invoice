from escpos.printer import Usb

# 假设的VID和PID，需要根据实际情况替换
VID = 3010
PID = 44085

try:
    # 初始化USB打印机（确保已连接）
    p = Usb(VID, PID)
    p.text("Hello, ESC/POS Printer!\n")
    p.cut()
except Exception as e:
    print("Error:", e)
