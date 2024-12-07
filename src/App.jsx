import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function ScreenShare() {
  const videoRef = useRef();
  const [startStream, setStream] = useState(true);
  const [start, setStart] = useState("");
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer("fusion_131120");
    peer.on("open", (id) => {});

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log(data);
        window.electronAPI.executeCmd(data);
      });
    });

    peer.on("call", (call) => {
      setStream(!startStream);
      call.answer();
      call.on("stream", (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.play();
        }
      });
    });
    peerInstance.current = peer;
  }, []);

  return (
    <div
      className="container"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <video
        style={{ width: "100%", height: "100%", backgroundColor: "black" }}
        ref={videoRef}
      ></video>
    </div>
  );
}

export default ScreenShare;
