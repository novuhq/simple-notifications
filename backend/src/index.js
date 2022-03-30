import {Server} from 'socket.io';
import { createServer } from "http";
const httpServer = createServer();
const io = new Server(httpServer);

const messages = {};
const ids = [1,2,3,4,5,6];
const clients = {};

(() => {
    const init = () => {
        io.on('connect', function(client) {
            clients[client.handshake.query.id] = client;

            client.on('disconnect', function () {
                delete clients[client.handshake.query.id];
            });

            if (messages[client.handshake.query.id]) {
                client.emit('messages', messages[client.handshake.query.id]);
            }
        });
    }

    const message = {message: 'hello'};

    const looper = () => {
            for (const id of ids) {
                messages[id] = (messages[id] || []).concat([{...message}]);
                if (clients[id]) {
                    clients[id].emit('messages', [message]);
                }
            }
        setTimeout(() => {
            looper();
        }, 10000);
    }


    init();
    looper();

    httpServer.listen(3000);
})();