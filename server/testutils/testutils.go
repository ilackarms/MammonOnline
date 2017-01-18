package testutils

import (
	log "github.com/Sirupsen/logrus"
	"github.com/googollee/go-socket.io"
	"github.com/zhouhui8915/go-socket.io-client"
	"net/http"
)

func SocketIOServer() (<-chan socketio.Socket, error) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		return nil, err
	}
	socketReady := make(chan socketio.Socket)
	server.On("connection", func(so socketio.Socket) {
		log.Println("socket.io new connection", so.Id())
		so.On("disconnection", func() {
			log.Println(so.Id() + " disconnected")
		})
		socketReady <- so
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("socket.io error:", err)
	})

	http.Handle("/socket.io/", server)
	log.Println("socket.io Serving at localhost:5000...")
	go func() {
		log.Fatal(http.ListenAndServe(":5000", nil))
	}()
	return socketReady, nil
}

func SocketIOClient() (*socketio_client.Client, error) {
	opts := &socketio_client.Options{
		Transport: "websocket",
		Query:     make(map[string]string),
	}

	return socketio_client.NewClient("http://localhost:5000/socket.io/", opts)
}
