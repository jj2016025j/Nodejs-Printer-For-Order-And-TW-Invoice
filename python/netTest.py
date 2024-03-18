import socket

PRINTER_IP = '192.168.1.175'
PRINTER_PORT = 9100

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((PRINTER_IP, PRINTER_PORT))
sock.sendall(b'Hello, network printer!')
sock.close()
