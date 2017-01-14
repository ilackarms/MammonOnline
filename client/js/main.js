// function main() {
    var socket = io();
    socket.on('welcome', function (data) {
        console.log('welcome to the server: ', data);
        socket.emit('asdf', 'hihi');
    });



// var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', {
    //     preload: function () {},
    //     create: function () {},
    //     update: function () {},
    //     render: function () {}
    // });
// }
//
// main();