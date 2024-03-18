const Evilscan = require('evilscan');

const options = {
    target: '127.0.0.1',
    port: '1-1024',
    status: 'O', // O for open
};

new Evilscan(options, function (err, scan) {
    if (err) {
        console.log(`Scanning error: ${err}`);
        return;
    }

    scan.on('result', function (data) {
        // fired when item is matching options
        console.log(data);
        // { ip: '127.0.0.1', port: 137, status: 'connect EACCES 127.0.0.1:137' }
        // { ip: '127.0.0.1', port: 135, status: 'open' }
        // { ip: '127.0.0.1', port: 445, status: 'open' }
    });

    scan.on('done', function () {
        // finished !
    });

    scan.run();
});
