// This is a generated file
// Socket connection from client to server
var socket;

// Unique Identifier for each client
// connection provided by server
var uniqueId;

// This is where all user information is stored.
var clientInfo = {

    // This is a string of the user's chosen name. Its value 
    // is provided by the user later on
    name:null,

    // The position of user's active Viewpoint
    // in the format [float, float, float]
    position:{"x": 2, "y": 1.5, "z": 5},

    // The orientation of the user's active Viewpoint
    // in the format [[boolean, boolean, boolean], float(radians)]
    orientation:[{"x": 0, "y": 0, "z": 0}, 0],

    // The path to the user's chosen avatar
    avatar:"avatars/FemaleTeen_aopted.x3d"
}

//-------------------------------------------------------
/**
 * Failure Exit alerts user when the service has
 * malfunctioned and stops the service
 */
var exit = function exit() {

    var text = "Something has gone wrong";
    for(var i=0; i < arguments.length; ++i)
        text += "\n" + arguments[i];
    console.log(text);
    alert(text);
    window.stop();
}

//-------------------------------------------------------
/*
 * A wrapper of document.getElementById(id) that adds
 * a check to insure that the element exists
 *
 * @param {string} id - The HTML id attribute value for the desired object
 */
function getElementById(id) {

    var element = document.getElementById(id);

    if(element == null)
        exit("document.getElementById(" + id + ") failed");
    return element;
}

/**
* Executed when the page has finished loading.
*/
window.onload = function () {
    // Scene model for client session
    var model = getElementById('mw_model');

    // default model
    // TODO: make this url path more relative so it works with URL=file://

    if(location.search.match(/.*(\?|\&)file=.*/) != -1)
        var url = location.search.replace(/.*(\?|\&)file=/,'').replace(/\&.*$/g, '');

    if(typeof url == undefined || url.length < 1) {

        // The default mode
        // This is the only place that we declare this.
        var url = '/mw/example.x3d';
    }

    model.url = url;

    //-------------------------------------------------------
    /**
     * Waits until the scene model has fully loaded and then
     * establishes socket callbacks
     */
    model.onload = function() {

        // Wait for user to enter a username for their session
        clientInfo.name = prompt("Enter your name:");

        // If the user has failed to enter a name,
        // store its value as an empty string momentarily
        if(clientInfo.name === null || clientInfo.name.length < 1) {

            clientInfo.name = "";
        }

        // Connect to the WebSocket server!
        var socket = new WebSocket("ws://127.0.0.1:8181");
    }

    /**
    * WebSocket onopen event. Confirms connection with the main server
    */
    socket.onopen = function (event) {
        label.innerHTML = "Main Server Connection open";

/** module check should be done when kinect module is connected with the main server
        //kinectModule connection check request to the Main Server
        socket.send("kinectCheck");
*/
    }
 
    /**
    * WebSocket onmessage event.
    */
    socket.onmessage = function (event) {
        if (typeof event.data === "string") {
/** module check should be done when kinect module is connected with the main server
            if (event.data === "kinectClosed")
            {
                alert("Kinect Connection is Closed.\nPlease run your kinect Module!");
            }
*/
        
            // Create a JSON object.
            var jsonObject = JSON.parse(event.data);

            console.log("Json Arrived");
            //context.fillStyle="#FFFFFF"; //Set white at an example
            //context.beginPath();
            //context.fillRect(0,0,640,480);
            //context.closePath();
            //context.fill();
                
             //Display the skeleton joints.
            for (var i = 0; i < jsonObject.skeletons.length; i++) { 
                // bones = populateBones(jsonObject.skeletons[i]);
                // boneCount = bones.length;
				var bonesX = [48];
				var bonesY = [48];
				var bonesZ = [48];
				var count = 0;
                for (var j = 0; j < jsonObject.skeletons[i].joints.length; j++) {
                    var joint = jsonObject.skeletons[i].joints[j];

                     //X3DOM stuff here
                        // Draw!!!                      
                        //context.translate(320,240);
                        //context.arc(joint.x * 400 +320, (-joint.y) * 400 +240, 5, 0, Math.PI * 2, true);
                        var x = joint.x;
                        var y = joint.y;
                        var z = joint.z;
						
						
						//  go through the json get each joint name .... get each element by its DEF (joint) name
			// change its translation atttribute to the x y z coords
    
					document.getElementById(joint.name).setAttribute("translation", x + " " + y + " " + z);
					
					// add point array here
					bonesX[count] = x;
					bonesY[count] = y;
					bonesZ[count] = z;
					count++;
					
				}
					document.getElementById('jointConnect').setAttribute("point", bonesX[3] + " " + bonesY[3] + " " + bonesZ[3] + " " + bonesX[2] + " " + bonesY[2] + " " + bonesZ[2] + " " + bonesX[2] + " " + bonesY[2] + " " + bonesZ[2] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[8] + " " + bonesY[8] + " " + bonesZ[8] + " " + bonesX[8] + " " + bonesY[8] + " " + bonesZ[8] + " " + bonesX[9] + " " + bonesY[9] + " " + bonesZ[9] + " " + bonesX[9] + " " + bonesY[9] + " " + bonesZ[9] + " " + bonesX[10] + " " + bonesY[10] + " " + bonesZ[10] + " " + bonesX[10] + " " + bonesY[10] + " " + bonesZ[10] + " " + bonesX[11] + " " + bonesY[11] + " " + bonesZ[11] + " " + bonesX[11] + " " + bonesY[11] + " " + bonesZ[11] + " " + bonesX[23] + " " + bonesY[23] + " " + bonesZ[23] + " " + bonesX[11] + " " + bonesY[11] + " " + bonesZ[11] + " " + bonesX[24] + " " + bonesY[24] + " " + bonesZ[24] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[4] + " " + bonesY[4] + " " + bonesZ[4] + " " + bonesX[4] + " " + bonesY[4] + " " + bonesZ[4] + " " + bonesX[5] + " " + bonesY[5] + " " + bonesZ[5] + " " + bonesX[5] + " " + bonesY[5] + " " + bonesZ[5] + " " + bonesX[6] + " " + bonesY[6] + " " + bonesZ[6] + " " + bonesX[6] + " " + bonesY[6] + " " + bonesZ[6] + " " + bonesX[7] + " " + bonesY[7] + " " + bonesZ[7] + " " + bonesX[7] + " " + bonesY[7] + " " + bonesZ[7] + " " + bonesX[21] + " " + bonesY[21] + " " + bonesZ[21] + " " + bonesX[7] + " " + bonesY[7] + " " + bonesZ[7] + " " + bonesX[22] + " " + bonesY[22] + " " + bonesZ[22] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[1] + " " + bonesY[1] + " " + bonesZ[1] + " " + bonesX[1] + " " + bonesY[1] + " " + bonesZ[1] + " " + bonesX[0] + " " + bonesY[0] + " " + bonesZ[0] + " " + bonesX[0] + " " + bonesY[0] + " " + bonesZ[0] + " " + bonesX[12] + " " + bonesY[12] + " " + bonesZ[12] + " " + bonesX[12] + " " + bonesY[12] + " " + bonesZ[12] + " " + bonesX[13] + " " + bonesY[13] + " " + bonesZ[13] + " " + bonesX[13] + " " + bonesY[13] + " " + bonesZ[13] + " " + bonesX[14] + " " + bonesY[14] + " " + bonesZ[14] + " " + bonesX[14] + " " + bonesY[14] + " " + bonesZ[14] + " " + bonesX[15] + " " + bonesY[15] + " " + bonesZ[15] + " " + bonesX[0] + " " + bonesY[0] + " " + bonesZ[0] + " " + bonesX[16] + " " + bonesY[16] + " " + bonesZ[16] + " " + bonesX[16] + " " + bonesY[16] + " " + bonesZ[16] + " " + bonesX[17] + " " + bonesY[17] + " " + bonesZ[17] + " " + bonesX[17] + " " + bonesY[17] + " " + bonesZ[17] + " " + bonesX[18] + " " + bonesY[18] + " " + bonesZ[18] + " " + bonesX[18] + " " + bonesY[18] + " " + bonesZ[18] + " " + bonesX[19] + " " + bonesY[19] + " " + bonesZ[19]);
				
			}
    
            // // Extract the values for each key.
            // var userName = jsonObject.name;
           // var userMessage = jsonObject.message;

            // // Display message.
           // chatArea.innerHTML = chatArea.innerHTML + "<p>" + userName + " says: <strong>" + userMessage + "</strong>" + "</p>";

            // // Scroll to bottom.
           // chatArea.scrollTop = chatArea.scrollHeight;
            
        }
        else if (event.data instanceof Blob) {
        
                    // RGB FRAME DATA
            // 1. Get the raw data.
            var blob = event.data;

            // 2. Create a new URL for the blob object.
            window.URL = window.URL || window.webkitURL;

            var source = window.URL.createObjectURL(blob);

            // 3. Update the image source.
            camera.src = source;

            // 4. Release the allocated memory.
            window.URL.revokeObjectURL(source);
            
            // document.write("Got the bodies data as Blob");
            // // 1. Get the raw data.
            // var blob = event.data;
            
            // // 2. Create a new URL for the blob object.
            // window.URL = window.URL || window.webkitURL;

            // var source = window.URL.createObjectURL(blob);

            // // 3. Update the image source.
            // video.src = source;
            
            // // 4. Release the allocated memory.
            // window.URL.revokeObjectURL(source);
        }
    }

    /**
    * WebSocket onclose event.
    */
    socket.onclose = function (event) {
        var code = event.code;
        var reason = event.reason;
        var wasClean = event.wasClean;

        if (wasClean) {
            label.innerHTML = "Connection closed normally.";
        }
        else {
            label.innerHTML = "Connection closed with message: " + reason + " (Code: " + code + ")";
        }
    }

    /**
    * WebSocket onerror event.
    */
    socket.onerror = function (event) {
        label.innerHTML = "Error: " + event;
    }

    buttonVideo.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.send("get-video");
        }
    }
    
    buttonBody.onclick = function(event){
        if (socket.readyState == WebSocket.OPEN) {
                socket.send("get-bodies");
            }
    }
    
    buttonColor.onclick = function(event){
        if (socket.readyState == WebSocket.OPEN) {
                socket.send("get-color");
            }
    }
    /**
    * Disconnect and close the connection.
    */
    buttonStop.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN) {
            socket.close();
        }
    }

    /**
    * Send the message and empty the text field.
    */
    buttonSend.onclick = function (event) {
        sendText();
    }

    /**
    * Send the message and empty the text field.
    */
    textView.onkeypress = function (event) {
        if (event.keyCode == 13) {
            sendText();
        }
    }

    /**
    * Send a text message using WebSocket.
    */
    function sendText() {
        if (socket.readyState == WebSocket.OPEN) {
            var json = '{ "name" : "' + nameView.value + '", "message" : "' + textView.value + '" }';
            socket.send(json);

            textView.value = "";
        }
    }
    
    
}
