const serverPort = 6699; // 이기야노데스웅챠
const serverHost = '127.0.0.1'
const dgram = require('dgram');
const fs = require('fs');
const makedir = require('make-dir');
const server = dgram.createSocket('udp4');
const command = {
    EVENT_LOG: 1,
    SERVER_LOG: 2,
    FETCH_ME_SOUL: 3,
}

server.on('listening', function () {
    const adr = server.address()
    console.log(`UDP SERVER IS LISTENING. PORT ${adr.port}`)
})

server.on('message', function (msg, remote) {
    const parsedMessage = JSON.parse(msg)

    if (parsedMessage && parsedMessage.c) {
        switch (parsedMessage.c) {
            case command.EVENT_LOG:
                appendEvent(parsedMessage.m)
                break;
            case command.SERVER_LOG:
                break;
            case command.FETCH_ME_SOUL:
                break;
        }
    }
});

server.on('error', (err) => {
    console.log(`server error: \n${err.stack}`);
});

server.bind(serverPort, serverHost);

const dateOption = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
};
const dateLocale = "ko-KR"
const logDir = "logs/"
const saveDir = logDir + "events/"

function appendEvent(message) {
    if (message) {
        const today = new Date();
        const fileName = `${today.toLocaleDateString(dateLocale, dateOption)}_nutscript.txt`
        const writeName = saveDir + fileName
        message = message + "\n"

        makedir(saveDir).then((path) => {
            fs.access(writeName, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.writeFile(writeName, message, 'utf8', (err) => {
                        try {
                            if (!err) {
                                console.log(new Date().toString(), " successfully wrote new line.")
                            } else {
                                throw err
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    });
                } else {
                    fs.appendFile(writeName, message, 'utf8', function (err) {
                        try {
                            if (!err) {
                                console.log(new Date().toString(), " successfully appended new event.")
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    });
                }
            });
        })
    }
}