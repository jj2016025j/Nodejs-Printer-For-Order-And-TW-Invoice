const os = require('os');

const interfaces = os.networkInterfaces();
console.log(interfaces);
// {
//     'Wi-Fi': [
//       {
//         address: 'fe80::d8d8:2b2a:47f7:5814',
//         netmask: 'ffff:ffff:ffff:ffff::',
//         family: 'IPv6',
//         mac: '28:11:a8:3f:d2:07',
//         internal: false,
//         cidr: 'fe80::d8d8:2b2a:47f7:5814/64',
//         scopeid: 15
//       },
//       {
//         address: '10.0.103.140',
//         netmask: '255.255.255.0',
//         family: 'IPv4',
//         mac: '28:11:a8:3f:d2:07',
//         internal: false,
//         cidr: '10.0.103.140/24'
//       }
//     ],
//     'Loopback Pseudo-Interface 1': [
//       {
//         address: '::1',
//         netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
//         family: 'IPv6',
//         mac: '00:00:00:00:00:00',
//         internal: true,
//         cidr: '::1/128',
//         scopeid: 0
//       },
//       {
//         address: '127.0.0.1',
//         netmask: '255.0.0.0',
//         family: 'IPv4',
//         mac: '00:00:00:00:00:00',
//         internal: true,
//         cidr: '127.0.0.1/8'
//       }
//     ]
//   }