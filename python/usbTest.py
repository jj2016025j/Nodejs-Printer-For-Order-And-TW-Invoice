# XXX
import usb.core
import usb.util

# 找到所有設備
devs = usb.core.find(find_all=True)
for dev in devs:
    print('Device:', dev.filename)
    print('  idVendor: %d (0x%04x)' % (dev.idVendor, dev.idVendor))
    print('  idProduct: %d (0x%04x)' % (dev.idProduct, dev.idProduct))

import psutil

# 列出所有網絡接口和狀態
print(psutil.net_if_addrs())
print(psutil.net_if_stats())

