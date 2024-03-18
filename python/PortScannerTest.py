# XXX

import nmap

nm = nmap.PortScanner()
nm.scan('127.0.0.1', '1-1024')  # 掃描本地主機上1到1024號端口

for host in nm.all_hosts():
    print('Host : %s (%s)' % (host, nm[host].hostname()))
    print('State : %s' % nm[host].state())
    for proto in nm[host].all_protocols():
        print('----------')
        print('Protocol : %s' % proto)

        lport = nm[host][proto].keys()
        for port in lport:
            print ('port : %s\tstate : %s' % (port, nm[host][proto][port]['state']))
