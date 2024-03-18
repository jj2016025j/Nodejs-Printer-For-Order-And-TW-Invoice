import usb.core
import usb.util

# 设定VID和PID
VID = 3010
PID = 44085

# 查找并设置设备
dev = usb.core.find(idVendor=VID, idProduct=PID)
if dev is None:
    raise ValueError('Device not found')

# 发送原始数据到打印机
try:
    # 选择第一个配置
    dev.set_configuration()
    # 假设使用端点1发送数据
    dev.write(1, b'Hello, PyUSB Printer!\n')
except Exception as e:
    print("Error:", e)
