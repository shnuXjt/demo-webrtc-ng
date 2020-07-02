import { Injectable } from "@angular/core";

@Injectable()
export class WebrtcService {
  myPeerConnection: RTCPeerConnection;

  myUsername: string; // 我的名字
  targetUsername: string; // 对象用户名

  createPeerConnection() {
    console.log('Setting up a connection...');

    const myPeerConnection = new RTCPeerConnection({
      iceServers: [
        // ICE 的信息
        {
          urls: ''
        }
      ]
    });

    myPeerConnection.onicecandidate = this.handleICECandidateEvent;
    myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    myPeerConnection.onsignalingstatechange = this.handleSingalingStateChangeEvent;
    myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
    myPeerConnection.ontrack = this.handleTrackEvent;

    this.myPeerConnection = myPeerConnection;
  }

  async handleNegotiationNeededEvent() {
    console.log('negotiation needed');

    const myPeerConnection = this.myPeerConnection;

    try {
      const offer = await myPeerConnection.createOffer();

      if (myPeerConnection.signalingState != "stable") {
        console.log("--- connection isn't stable yet; postponing...");
        return;
      }

      // 将offer作为本地的description保存
      await myPeerConnection.setLocalDescription(offer);

      this.sendToServer({
        name: this.myUsername,
        target: this.targetUsername,
        type: '', // 自定义type
        sdp: myPeerConnection.localDescription
      })

    } catch(e) {

    }
  }

  // signal server；  将数据发送到服务器
  sendToServer(obj: any) {}
}