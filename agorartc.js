let handlefail = function(err){
    console.log(err)
}

function showUser(username) {
    let particDiv = document.getElementById("participants");
    let listElement = document.createElement("li");
    listElement.textContent = username;
    particDiv.appendChild(listElement); 
} 

function addVideoStream(streamId){
    console.log()
    let remoteContainer = document.getElementById("remoteStream");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    // streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "250px"
    remoteContainer.appendChild(streamDiv)
} 

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "dd02efac322a401eb6dd6871f2de3cd1";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail
    )

    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail)
    })

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());  
        stream.play(stream.getId());
    })
    showUser(Username);
}