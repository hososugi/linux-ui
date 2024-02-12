const express = require('express');
const { Client } = require('ssh2');
const app = express();

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]});
})

app.get('/api/uptime', (req, res) => {
    var responseData;

    const conn = new Client();
    conn.on('ready', () => {
        console.log('Client :: ready');
        conn.exec('uptime', (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
                
                res.json({"uptime": responseData});
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
                responseData = data.toString();
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });

        });
    }).connect({
        host: 'localhost',
        port: 2222,
        username: 'ubuntu',
        password: 'dwheeler'
        //privateKey: readFileSync('/path/to/my/key')
    });

})

app.listen(5000, () => {console.log("Server started on port 5000")})