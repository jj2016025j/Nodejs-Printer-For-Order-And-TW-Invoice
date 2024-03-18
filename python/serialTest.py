import serial

# pip install pyserial

# 打开串口
# 替换'COM3'为你的打印机实际连接的COM端口
ser = serial.Serial('COM3', 9600)  # Windows下的串口设备示例

try:
    # 发送文本到打印机
    ser.write(b'Hello, Serial Printer!\n')
finally:
    ser.close()
