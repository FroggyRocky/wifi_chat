const dgram = require('dgram');
const readline = require('readline');


const socket = dgram.createSocket('udp4');

const PORT = 5000;
const BROADCAST_ADDR = '255.255.255.255';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You: '
});


const sendMessage = (message) => {
    const messageBuffer = Buffer.from(message);
    socket.send(messageBuffer, 0, messageBuffer.length, PORT, BROADCAST_ADDR, (error) => {
        if (error) {
            console.error(`Error sending message: ${error.message}`);
        } else {
            console.log(`Sent ${messageBuffer.length} bytes to ${BROADCAST_ADDR}:${PORT}`);
        }
    });
};


socket.on('message', (message, rinfo) => {
    process.stdout.clearLine(); // Clear the current line of the console
    process.stdout.cursorTo(0); // Move the cursor to the start of the line
    console.log(`Message from ${rinfo.address}:${rinfo.port}: ${message}`);
    rl.prompt(); // Restore the input prompt after receiving a message
});

// Bind the socket to a port and start listening for incoming messages
socket.bind(PORT, () => {
    console.log(`Listening for UDP messages on port ${PORT}`);
    socket.setBroadcast(true);
    rl.prompt();
});


rl.prompt();
rl.on('line', (input) => {
    // Send the input message when the user hits 'Enter'
    sendMessage(input);
    rl.prompt();
});

rl.on('close', () => {
    console.log('Exiting chat...');
    socket.close();
    process.exit(0);
});