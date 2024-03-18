import usb.core
import usb.util

# 找到打印机
PRINTER_VID = 3010  # 替换为打印机的VID
PRINTER_PID = 44085  # 替换为打印机的PID
device = usb.core.find(idVendor=PRINTER_VID, idProduct=PRINTER_PID)

if device is None:
    raise ValueError("设备未找到")

# 确保打印机处于“已配置”状态
device.set_configuration()

# 找到打印端点
cfg = device.get_active_configuration()
interface_number = cfg[(0,0)].bInterfaceNumber
alternate_setting = usb.control.get_interface(device, interface_number)
intf = usb.util.find_descriptor(
    cfg, bInterfaceNumber = interface_number,
    bAlternateSetting = alternate_setting
)

ep = usb.util.find_descriptor(
    intf,
    custom_match = lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_OUT
)

assert ep is not None

# 发送数据到打印机
data = b"Hello, printer!"
ep.write(data)
