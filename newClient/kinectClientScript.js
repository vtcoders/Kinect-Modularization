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
        // !!Caution!! directory problem
        var url = '/newClient/example.x3d';
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
        console.log("Emitting new Connection");
        label.innerHTML = "Main Server Connection open";

        //kinectModule connection check request to the Main Server
        socket.send("kinectCheck");
    }
 
    /**
    * WebSocket onmessage event.
    */
    socket.onmessage = function (event) {
        //Parse the message as JSON to decode the command and actual message
        var command = JSON.parse(event.data);

        /**
             * This command is fired when client connects for the first time
             *
             * This command will have two paramaters inside the JSON
             *
             * myId - Server generated unique identifier for the user
             * userList - Array of users in the scene and their names, position, orientation, and avatars
             */
            if (command.type === 'initiate') {
                var message = command.message;

                // TODO: Turn JSON serialized data into two paramaters

                // Save unique id provided by server
                uniqueId = myId;

                // If no public name was entered in the prompt,
                // name defaults to unique id
                if (clientInfo.name == "") {

                    clientInfo.name = myId;
                }

                // Get location in HTML to store avatars
                var avatarGroup = getElementById("avatarGroup");
                avatarGroup.innerHTML = "";

                // Get X3D Scene object 
                var scene = document.getElementsByTagName("Scene")[0];
                
                // Get user console 
                var userConsole = getElementById("users");
                userConsole.innerHTML = "";

                // Add content for each of the users
                for (var userId in userList) {

                    var current = userList[userId];

                    // Generate a Transform to hold current's avatar
                    var userAvatar = document.createElement('Transform');
                    userAvatar.setAttribute("translation", "0 -.5 .5");
                    userAvatar.setAttribute("rotation", "0 0 0 0");
                    userAvatar.setAttribute("id", userId + "Avatar");

                    // Generate an Inline to hold X3D avatar
                    var characterOfAvatar = document.createElement('inline');
                    characterOfAvatar.setAttribute("id", userId + "Inline");
                    characterOfAvatar.setAttribute("url", current.avatar);

                    // Add x3d model to the avatar Transform
                    userAvatar.appendChild(characterOfAvatar);

                    // If adding self, add to a bundle with camera
                    if (userId == uniqueId) {

                        // Generate a Transform to hold user's camera and avatar
                        var userBundle = document.createElement('Transform');
                        userBundle.setAttribute("id", userId + "Bundle");

                        userBundle.setAttribute("translation", current.position.x + " " +
                            current.position.y + " " + current.position.z);

                        userBundle.setAttribute("rotation", current.orientation[0].x + " " +
                            current.orientation[0].y + " " + current.orientation[0].z + " " +
                            current.orientation[1]);

                        // Make generated bundle a child of the X3D scene
                        scene.appendChild(userBundle);

                        // Make avatar a child of the bundle
                        userBundle.appendChild(userAvatar);

                        // Add a message to the chat window that someone is joining
                        var welcomeMessage = "" + current.name + " is joining the scene.";
                        socket.emit('chatMessage', "", welcomeMessage);
                    } 

                    // If adding someone else, add them to the group of other avatars
                    else {

                        avatarGroup.appendChild(userAvatar)
                    }

                    console.log("Updating console");

                    console.log(current.position.y);
                    console.log(current.orientation);

                    // Add user and information to HTML console
                    var userListEntry = document.createElement('span');
                    var newPLine = document.createElement('p');
                    userListEntry.setAttribute("id", userId);
                    userListEntry.innerHTML = (current.name + " observing at: " 
                        + current.position.x + ", " + current.position.y + ", " + current.position.z);
                    userConsole.appendChild(newPLine);                  
                    userConsole.appendChild(userListEntry);     
                }
            }

            /**
             * This command is fired when a new user (that is not yourself) connects
             *
             * This command will have two paramaters inside the JSON
             *
             * newestUser - This is the array of user data
             * userId - This is the unique identifier for the new user
             */
            if (command.type === 'addUser') {
                var message = command.message;

                // TODO: Turn JSON serialized data into two paramaters

                console.log("New User Fired");

                // Get container for avatar group
                var avatarGroup = getElementById("avatarGroup");

                // Create node to contain avatar information
                var userAvatar = document.createElement('Transform');

                // Set avatar position and orientation information
                userAvatar.setAttribute("translation", newestUser.position.x + " " +
                    newestUser.position.y + " " + newestUser.position.z);

                userAvatar.setAttribute("rotation", newestUser.orientation[0].x + " " +
                    newestUser.orientation[0].y + " " + newestUser.orientation[0].z + " " +
                    newestUser.orientation[1]);

                // Set avatar id
                userAvatar.setAttribute("id", userId + "Avatar");

                console.log("Created node: " + userAvatar.getAttribute("id"));

                // Create inline to hold X3D avatar
                var inlineElement = document.createElement('inline');
                inlineElement.setAttribute("id", userId + "Inline");
                inlineElement.setAttribute("url", newestUser.avatar);

                // Make avatar a child of the avatar group
                userAvatar.appendChild(inlineElement);
                avatarGroup.appendChild(userAvatar);

                // Update HTML Console
                console.log("Adding User: ", userId);
                var userList = getElementById("users");
                var userListEntry = document.createElement('span');;
                var newPLine = document.createElement('p');
                userListEntry.setAttribute("id", userId);
                userListEntry.innerHTML = (newestUser.name + " observing at: " +
                    newestUser.position.x + ", " + newestUser.position.y + ", " +
                    newestUser.position.z);
                userList.appendChild(newPLine);
                userList.appendChild(userListEntry);
            }

            /**
             * This command is fired when a client (that is not yourself) is leaving the scene
             *
             * This command will have two paramaters inside the JSON
             *
             * user - This is the array of user information
             * id - This is the unique identifier for the user
             */
            if (command.type === 'deleteUser') {
                var message = command.message;

                // TODO: Turn JSON serialized data into two paramaters

                // Get a reference to the avatar in the scene
                var removeAvatar = document.getElementById(id + "Avatar");

                // Check if the avatar exists
                if(removeAvatar != null) {

                    var avatars = getElementById("avatarGroup");
                    avatars.removeChild(removeAvatar);
                }

                // Remove User's HTML Content
                var users = getElementById("users");
                var remove = getElementById(id);
                users.removeChild(remove);
            }
            /**
             * This command is fired when a message has been posted to the chatroom
             *
             * This command will have two paramaters inside the JSON
             *
             * userName - This is the name the user provided when logging in
             * message - This is the content to be posted to the chat window
             */
            if (command.type === 'chatUpdate') {
                var message = command.message;

                // TODO: Turn JSON serialized data into two paramaters

                // Create new line item to hold message
                var newMessage = document.createElement('li');

                // If a user with a userName posted the message
                if (userName != "") {

                    var nameTag = document.createElement('span');
                    nameTag.innerHTML = "<em>" + userName + "</em>";

                    newMessage.appendChild(nameTag);
                    newMessage.appendChild(document.createElement("br"));
                    newMessage.appendChild(document.createTextNode(message));

                } 

                // If no userName has been provided, message should be 
                // formatted as a notification
                else {

                    var note = document.createElement('span');
                    note.innerHTML = "<em>" + message + "</em>";
                    newMessage.appendChild(note);
                }

                // Add the new message to the chat window
                getElementById("messages").appendChild(newMessage);
            }

            /**
             * This command is fired when an object in the scene has changed 
             * states (i.e. A lamp has been turned on/off)
             *
             * This command will have three paramaters inside the JSON
             *
             * type - This is the type of object that 
             *      has been changed (lamp)
             * id - This is the unique identifier for the
             *      object being updated
             * state - This is the state for the object
             *      object in the scene (lamp on = true, lamp off = false)
             */
            if (command.type === 'sceneUpdate') {
                var message = command.message;

                // TODO: Turn JSON serialized data into three paramaters

                console.log("Scene Update");

                switch (type) {

                    case "lamp" :                   

                        // Get the light bulb element in the scene
                        var lightBulb = getElementById("mw__" + id);

                        // Get material for that object
                        var mat = lightBulb.getElementsByTagName("Material");

                        if (!state) {

                            // Set color to gray
                            mat[0].setAttribute("diffuseColor", ".64 .69 .72");
                        } 
                        else {
                    
                            // Set color to yellow
                            mat[0].setAttribute("diffuseColor", ".95, .9, .25");
                        }
                        break;
                }
            }


            if (command.type === 'kinectClosed')
                {
                    var textKinectFailure = "Kinect Connection is Closed.\nPlease run your kinect Module!";
                    console.log(textKinectFailure);
                    alert(textKinectFailure);
                    window.stop();
                }
            if (command.type === 'kinectUnavailable')
                {
                    var textKinectFailure = "Kinect sensor Unavailable.\nPlease turn on your kinect sensor!";
                    console.log(textKinectFailure);
                    alert(textKinectFailure);
                    window.stop();
                }

            //This message should be sent by the main server everytime new joint data received???
            if (command.type === "clientKinectUpdate") {
                if (command.kinectType === "body")
                {
                    var message = command.message;
                
                    // Create a JSON object.
                    var jsonObject = JSON.parse(message);

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
            
                            getElementById(joint.name).setAttribute("translation", x + " " + y + " " + z);
                            
                            // add point array here
                            bonesX[count] = x;
                            bonesY[count] = y;
                            bonesZ[count] = z;
                            count++;
                            
                        }
                        getElementById('jointConnect').setAttribute("point", bonesX[3] + " " + bonesY[3] + " " + bonesZ[3] + " " + bonesX[2] + " " + bonesY[2] + " " + bonesZ[2] + " " + bonesX[2] + " " + bonesY[2] + " " + bonesZ[2] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[8] + " " + bonesY[8] + " " + bonesZ[8] + " " + bonesX[8] + " " + bonesY[8] + " " + bonesZ[8] + " " + bonesX[9] + " " + bonesY[9] + " " + bonesZ[9] + " " + bonesX[9] + " " + bonesY[9] + " " + bonesZ[9] + " " + bonesX[10] + " " + bonesY[10] + " " + bonesZ[10] + " " + bonesX[10] + " " + bonesY[10] + " " + bonesZ[10] + " " + bonesX[11] + " " + bonesY[11] + " " + bonesZ[11] + " " + bonesX[11] + " " + bonesY[11] + " " + bonesZ[11] + " " + bonesX[23] + " " + bonesY[23] + " " + bonesZ[23] + " " + bonesX[11] + " " + bonesY[11] + " " + bonesZ[11] + " " + bonesX[24] + " " + bonesY[24] + " " + bonesZ[24] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[4] + " " + bonesY[4] + " " + bonesZ[4] + " " + bonesX[4] + " " + bonesY[4] + " " + bonesZ[4] + " " + bonesX[5] + " " + bonesY[5] + " " + bonesZ[5] + " " + bonesX[5] + " " + bonesY[5] + " " + bonesZ[5] + " " + bonesX[6] + " " + bonesY[6] + " " + bonesZ[6] + " " + bonesX[6] + " " + bonesY[6] + " " + bonesZ[6] + " " + bonesX[7] + " " + bonesY[7] + " " + bonesZ[7] + " " + bonesX[7] + " " + bonesY[7] + " " + bonesZ[7] + " " + bonesX[21] + " " + bonesY[21] + " " + bonesZ[21] + " " + bonesX[7] + " " + bonesY[7] + " " + bonesZ[7] + " " + bonesX[22] + " " + bonesY[22] + " " + bonesZ[22] + " " + bonesX[20] + " " + bonesY[20] + " " + bonesZ[20] + " " + bonesX[1] + " " + bonesY[1] + " " + bonesZ[1] + " " + bonesX[1] + " " + bonesY[1] + " " + bonesZ[1] + " " + bonesX[0] + " " + bonesY[0] + " " + bonesZ[0] + " " + bonesX[0] + " " + bonesY[0] + " " + bonesZ[0] + " " + bonesX[12] + " " + bonesY[12] + " " + bonesZ[12] + " " + bonesX[12] + " " + bonesY[12] + " " + bonesZ[12] + " " + bonesX[13] + " " + bonesY[13] + " " + bonesZ[13] + " " + bonesX[13] + " " + bonesY[13] + " " + bonesZ[13] + " " + bonesX[14] + " " + bonesY[14] + " " + bonesZ[14] + " " + bonesX[14] + " " + bonesY[14] + " " + bonesZ[14] + " " + bonesX[15] + " " + bonesY[15] + " " + bonesZ[15] + " " + bonesX[0] + " " + bonesY[0] + " " + bonesZ[0] + " " + bonesX[16] + " " + bonesY[16] + " " + bonesZ[16] + " " + bonesX[16] + " " + bonesY[16] + " " + bonesZ[16] + " " + bonesX[17] + " " + bonesY[17] + " " + bonesZ[17] + " " + bonesX[17] + " " + bonesY[17] + " " + bonesZ[17] + " " + bonesX[18] + " " + bonesY[18] + " " + bonesZ[18] + " " + bonesX[18] + " " + bonesY[18] + " " + bonesZ[18] + " " + bonesX[19] + " " + bonesY[19] + " " + bonesZ[19]);
                        
                    }
            
                    // // Extract the values for each key.
                    // var userName = jsonObject.name;
                   // var userMessage = jsonObject.message;

                    // // Display message.
                   // chatArea.innerHTML = chatArea.innerHTML + "<p>" + userName + " says: <strong>" + userMessage + "</strong>" + "</p>";

                    // // Scroll to bottom.
                   // chatArea.scrollTop = chatArea.scrollHeight;
                    
                }
                // TODO: we need better else if statement, instead of else
                else {
                    // RGB FRAME DATA
                    // 1. Get the raw data.
                    var blob = command.message;

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

            // Set up the models, lamps, and in-scene events
            configureScene();

            // Set up the widgets 
            configureToolbar();
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
}
