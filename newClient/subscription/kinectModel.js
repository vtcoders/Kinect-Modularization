
(function () {
	var kinectRate = 60; /*In Frames Per Second*/

	var mw = mw_getScriptOptions().mw;

	// kinect models will be an array of all available kinect connections
	var kinectModels = null;


	function addKinectModel(kinectJsonData) {

		console.log("Using Kinect Module");

		/* Create a new subscription for each client that calls this.
	     * We don't care what this subscription is called, it's just
	     * defined by this javaScript code, so it's anonymous. */
	    mw.getSubscriptionClass(
	    	'user_kinect_Module'/*unique class name*/,
	    	'kinect' /*shortname*/,
	    	'user_kinect' /*description*/,

			/* Subscription Creator initialization */
            function() {

                // *this* is the subscription.
                //
                // We do not read our own avatar.  We have not really
                // subscribed yet given that the subscription has not been
                // initialized on the server yet.
                //
                // Subscriptions are subscribed to by default, we don't
                // need to read our avatar URL because we know it.
                this.unsubscribe();


                // We need this subscription to go away when this client
                // quits.
                this.makeOwner();

                // TODO: Add widget event handler that will call:
                // this.write(kinectRate) to change the rate of
                // json emission.

                // TODO: Question about the child subscription to Lance.
                // Why do we need the child and how does it work?
            }

            /* Subscription reader */
            function(kinectJsonData) {

            	// TODO: give this back to the client to draw json on html
            }

            /* Cleanup function */
            //No cleanup function at this point


	    	)
	}
})