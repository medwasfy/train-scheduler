$(document).ready(function() {


    //display current time 
    var update;
    (update = function() {
        document.getElementById("datetime")
        .innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
      })();
    setInterval(update, 1000);

    // add refresh result function to the page=========
    $(".glyphicon-refresh").click(function () {
        location.reload(true);
        resetTime();
    });

    
    // Initialize Firebase ============================
    var config = {
      apiKey: "AIzaSyCDSsHMOfn3Awq9aHK-dEP1jnR7F4kkcWU",
      authDomain: "trainapp-4dd33.firebaseapp.com",
      databaseURL: "https://trainapp-4dd33.firebaseio.com",
      projectId: "trainapp-4dd33",
      storageBucket: "trainapp-4dd33.appspot.com",
      messagingSenderId: "605688994150"
    };
    firebase.initializeApp(config);
  
  var database = firebase.database();

   
  // on click event listener for adding Trains
  $("#add-train").on("click", function(event) {
          event.preventDefault();
          
	 // create variables to store and grab user input
	  var trainName = $("#train-name-input").val().trim();
	  var trainDest = $("#dest-input").val().trim();
	  var firstTrain = $("#firstTrain-input").val().trim();
      var trainFreq = $("#freq-input").val().trim();
      

                // --------------------------- Sanity Check for user input ---------------------------
                if(trainName == "" || trainName == null){
                    alert("Please enter a Train Name!");
                    return false;
                }
                else if(trainDest == "" || trainDest == null){
                    alert("Please enter a Train Destination!");
                    return false;
                }
                else if(firstTrain == "" || firstTrain == null){
                    alert("Please enter a First Arrival Time for this train!");
                    return false;
                }
                else if(trainFreq == "" || trainFreq == null || trainFreq < 1){
                    alert("Please enter an arrival frequency (in minutes)!" + "\n" + "It must be greater than 0.");
                    return false;
                }
                // ------------------------------------------------------------------------------------


      
      // add data to firebase
	  database.ref().push({
	  	name: trainName,
	  	destination: trainDest,
	  	start: firstTrain,
        frequency: trainFreq
          
      });

	 // Alert train added
  		alert("Train successfully added");

	 // clear all of the text-boxes for new submission
	  $("#train-name-input").val("");
	  $("#dest-input").val("");
	  $("#firstTrain-input").val("");
	  $("#freq-input").val("");
      });


  	// create Firebase event for adding train to the database and a row in the html when a user adds an entry
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	  console.log(childSnapshot.val());

	  // get the values and store them into a variable.
	  var trainName = childSnapshot.val().name;
	  var trainDest = childSnapshot.val().destination;
	  var firstTrain = childSnapshot.val().start;
	  var trainFreq = childSnapshot.val().frequency;

  	  // declare start time
   		 var firstTime = 0;

      // change time display format
      // refer to documentation for this line
      // First Time (pushed back 1 year to make sure it comes before current time)
	   var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
	    console.log(firstTimeConverted);

	  // Current Time
	    var currentTime = moment();
	    console.log("current time: " + moment(currentTime).format("HH:mm"));

	  // Difference between the times
		var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("time difference from last train till now: " + timeDiff);

		// Time apart (remainder)
	    var remainTime = timeDiff % trainFreq;
	    console.log(remainTime);

	    // Minute Until Train
	    var minTillTrain = trainFreq - remainTime;
	    console.log("time remaining till next train arrives: " + minTillTrain);

	    // Next Train
	    var nextTrain = moment().add(minTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

	  // Add each train's data into the table
	  $("#table").prepend("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + 
	   "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minTillTrain + "</td></tr>");
    });
    
    
});