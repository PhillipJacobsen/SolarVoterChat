function startConnect() {
    if (connected_flag==1) {
        debug("already connected");
    } else { 
    document.getElementById("connectButton").disabled = true;

    var wsbroker = "mqttauth.littleyus.com";  //mqtt websocket enabled broker
    var wsport = 15675; // websocket port
    mqttUsername = document.getElementById("username").value; 
    mqttPassword = document.getElementById("password").value; 
    chatName = document.getElementById("chatname").value; 
    
    client = new Paho.MQTT.Client(wsbroker, wsport, "/ws",chatName+signedMessage);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    var options = {
        timeout: 3,
        userName : mqttUsername,
        password : mqttPassword,            
        keepAliveInterval: 30,
        onSuccess: function () {
            debug("CONNECTION SUCCESS");
            displayReceivedData("CONNECTION SUCCESS");
            client.subscribe("chat/#", {qos: 1});
            document.getElementById("connectButton").disabled = true;
            connected_flag=1;
        },
        onFailure: function (message) {
            debug("CONNECTION FAILURE - " + message.errorMessage);
            displayReceivedData("CONNECTION FAILURE - " + message.errorMessage);
            document.getElementById("connectButton").disabled = false;
            connected_flag=0;
        }
    
    };

    if (location.protocol == "https:") {
        options.useSSL = true;
    }


    debug("CONNECT TO " + wsbroker + ":" + wsport);
    displayReceivedData("CONNECT TO " + wsbroker + ":" + wsport);
    client.connect(options);
    }
}       


function startDisconnect() {
    if (connected_flag==1) {
    client.disconnect();
    debug("Disconnected from server");
    } else {
    debug("Not connected to server");
}
}


function onConnectionLost (responseObject) {
    displayReceivedData("CONNECTION LOST - " + responseObject.errorMessage);   
    debug("CONNECTION LOST - " + responseObject.errorMessage); 
    document.getElementById("connectButton").disabled = false;
    connected_flag=0;
//   document.getElementById("first").innerHTML.clear;
 
// This totally deletes the display box
//   const container = document.getElementById('first');
//   container.replaceChildren();
//   container.textContent = '';
//   container.innerHTML = '';
//      container.scrollTop = 10;
// Use this command if you want to keep divClone as a copy of "#some_div"
//$("#first").replaceWith(divClone.clone()); // Restore element with a copy of divClone

}

// use this if publishing on chat/username
function onMessageArrived (message) {
    debug("RECEIVE ON " + message.destinationName + " PAYLOAD " + message.payloadString);
const topic = message.destinationName;
const topicArray = topic.split("/");
    var wallet = topicArray[1];
     var name = topicArray[2];
    var shortenedWallet = wallet.slice(0,4) + ".." + wallet.slice(-4);
     displayReceivedData(name + ":" + shortenedWallet + ":  " + message.payloadString);    
    
}

//use this if publishing on chat/username/chatname
// function onMessageArrived (message) {
//     debug("RECEIVE ON " + message.destinationName + " PAYLOAD " + message.payloadString);
//     var wallet = message.destinationName.slice(5);
//     var shortenedWallet = wallet.slice(0,5) + "..." + wallet.slice(-5);
//     displayReceivedData(shortenedWallet + ":  " + message.payloadString);  
    
// }

