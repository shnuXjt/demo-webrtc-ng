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
    myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
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

  handleTrackEvent(event) {
    console.log('----track-----');
    const srcObject = event.streams[0];
  }

  // ICE candidate 发送到别的端 通过signaling server
  handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    const candidate = event.candidate;

    this.sendToServer({})
  }

  

  // signal server；  将数据发送到服务器
  sendToServer(obj: any) {}

  handleICEConnectionStateChangeEvent(event) {
    console.log('------ ICE connection 状态改变： ', this.myPeerConnection.iceConnectionState , '------------');

    switch(this.myPeerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  // signal server 连接 状态改变
  handleSignalingStateChangeEvent() {
    console.log('------ WebRTC signaling state changed to: ', this.myPeerConnection.signalingState, ' -------');
    const state = this.myPeerConnection.signalingState;
    switch(state) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }


  // 代表当前 ICE engine 工作模式：
  // ‘new’ ： 目前没有网络连通
  // ‘gathering’ ： ICE engine目前正在搜集 网络协商
  // ‘complete’ 收集结束

  handleICEGatheringStateChangeEvent(event: Event) {
    console.log('------ ICE 收集状态改编为： ', this.myPeerConnection.iceGatheringState);
  }

  closeVideoCall() {
    console.log('----- 关闭链接 ----');
    if (this.myPeerConnection) {
      this.myPeerConnection.ontrack = null;
      this.myPeerConnection.onicecandidate = null;
      this.myPeerConnection.oniceconnectionstatechange = null;
      this.myPeerConnection.onsignalingstatechange = null;
      this.myPeerConnection.onicegatheringstatechange = null;
      // this.myPeerConnection.onnotificationneeded = null;

      // 关闭 PeerConnection
      this.myPeerConnection.close();
      this.myPeerConnection = null;
      
    }

    this.myPeerConnection.getTransceivers().forEach(transceiver => {
      transceiver.stop();
    })
  }
}