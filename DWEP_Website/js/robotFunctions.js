
// Initialization function that allows the robot to connect.

function init() {

  session = new QiSession();
  session.socket().on('connect', function() {
      console.log("QiSession connected!");
  }).on('disconnect', function() {
      console.log("QiSession disconnect");
  });

  // // Battery indicator.
  // getBatteryLevel(); // Initialize.
  // subBatteryUpdate(); // Update.
  // subBatteryChargeUpdate(); // Update charge icon.

  // // Behaviour indicator.
  // updateCurrentBehaviours(); // Initialize.
  // subBehaviourUpdate(); // Update behaviour readout.

  // // Volume slider.
  setupVolumeSlider();

}

// Declare session variable.
var session; 

// Create volume slider.
var volSlider = new Slider('#volume', {
  formatter: function(value) {
      return value + '%';
  }
});

// Async functions

function getBatteryLevel() {
  session.service("ALBattery").done(function(battery) {
      battery.getBatteryCharge().done(function(charge) {
          document.getElementById("chargeLevel").value = charge + "%";
      });
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

function subBatteryUpdate() {
  session.service("ALMemory").done(function(ALMemory) {
      ALMemory.subscriber("BatteryChargeChanged").done(function(subscriber) {
          subscriber.signal.connect(function(state) {
              document.getElementById("chargeLevel").value = state + "%";
          });
      });
  });
}

function subBatteryChargeUpdate() {
  session.service("ALMemory").done(function(ALMemory) {
      ALMemory.subscriber("BatteryPowerPluggedChanged").done(function(subscriber) {
          subscriber.signal.connect(function(state) {
              boolState = state ? "visible" : "hidden";
              document.getElementById("chargeState").style.visibility = boolState;
          });
      });
  });
}

function headTempUpdate() {
  session.service("ALMemory").done(function(ALMemory) {
      ALMemory.subscriber("Device/SubDeviceList/Head/Temperature/Sensor/Value").done(function(subscriber) {
          subscriber.signal.connect(function(state) {
              label = document.getElementById("headTemp");
              label.text = state + "%";
              label.class = "btn btn-danger";
          });
      });
  });
}

function updateCurrentBehaviours() {
  session.service("ALBehaviorManager").done(function(bm) {
      bm.getRunningBehaviors().done(function(running) {
          //console.log(running);
          behavText = "Not running."
          if (running.length > 0) { behavText = running[0] };
          if (running.length > 1) { behavText += " and " + (running.length - 1) + " more." };
          document.getElementById("currentBehaviour").text = behavText;
      });
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

function subBehaviourUpdate() {
  session.service("ALMemory").done(function(ALMemory) {
      ALMemory.subscriber("ALBehaviorManager/BehaviorsLoaded").done(function(subscriber) {
          subscriber.signal.connect(function(state) {
              updateCurrentBehaviours();
          });
      });
  });
}

function getVolumeLevel() {
  session.service("ALAudioDevice").done(function(audio) {
      audio.getOutputVolume().done(function(masterVolume) {
          console.log(masterVolume);
          return masterVolume;
      });
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

function setVolumeLevel(newVol) {
  session.service("ALAudioDevice").done(function(audio) {
      audio.setOutputVolume(newVol).done(function(masterVolume) {
          console.log(masterVolume);
      });
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

var setVolumeLevelToSlider = function() {
  session.service("ALAudioDevice").done(function(audio) {
      audio.setOutputVolume(volSlider.getValue()).done(function(masterVolume) {});
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Volume slider call 
function setupVolumeSlider() {
  volSlider.setValue(getVolumeLevel());
  session.service("ALAudioDevice").done(function(audio) {
      audio.getOutputVolume().done(function(masterVolume) {
          volSlider.setValue(masterVolume);
      });
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
  volSlider.on('slide', setVolumeLevelToSlider);
}

// Yoga behaviour function call.
const YOGA_BEHAVIOURS =  "sycamore-yoga/" // Application ID
function yoga() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(YOGA_BEHAVIOURS + "yoga"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Text-to-speech function.
function speak(dialogue) {
  session.service("ALTextToSpeech").done(function(tts) {
       // dialogue = document.getElementById("form19").value; // has been commented off to make the kill function work
      tts.say(dialogue);
      console.log(dialogue);
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });




}
function tts() {
speak(document.getElementById("form19").value) // This new parameter is parsed to allow the kill function to give auditory feedback
}

// Kill function
function stop_all() {
  session.service("ALBehaviorManager").done(function(bm) {
      bm.getRunningBehaviors().then(function(rb) {
          if (rb) {
              console.log(rb)
              for (var i = 0; i < rb.length; i++) {
                  bm.stopBehavior(rb[i])
                  console.log('stopped ' + rb[i])
              }
          }
          speak("Okay, stopped!"); // Speak command.
      });
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}


// Button disabled. 


// Cooking steps behaviour function.
const COOKING_BEHAVIOURS =  "sycamore-cooking/" // Application ID
function cooking_steps() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(COOKING_BEHAVIOURS + "Yoghurt Cooking Lesson"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Stories to Read behaviour function.
const STORY_BEHAVIOURS =  "sycamore-story/" // Application ID
function stories() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(STORY_BEHAVIOURS + "OutOfTheEgg"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Words on command behaviour function.
const WORDS_BEHAVIOURS =  "sycamore-words-on-command/" // Application ID
function words_on_command() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS + "words on command"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Stop behaviour function.

function stop_word() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS + "stop"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Go behaviour function.

function go_word() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS + "go"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Great job behaviour function.

function great_job() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS+ "great job"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Sit down behaviour function

function sit_down() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS + "sit down"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Wait behaviour function

function wait() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS + "wait"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
//  Your turn behaviour function
function your_turn() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WORDS_BEHAVIOURS + "your turn"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Alphabet behaviour function.
const ALPHABET =  "sycamore-alphabet/" // Application ID
function alphabet() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(ALPHABET + "Alphabet"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Wellbeing behaviour function.
const WELLBEING_BEHAVIOURS ="sycamore-wellbeing/" // Application ID
function food_safety() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WELLBEING_BEHAVIOURS + "Food Safety"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Listening function
function listening() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WELLBEING_BEHAVIOURS + "Listening"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Slow it down
function slow_it_down() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(WELLBEING_BEHAVIOURS + "Slow it down"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

const STRETCHING_BEHAVIOURS = 'sycamore-stretching/'
// Stretching
function stretching() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(STRETCHING_BEHAVIOURS + "Combo"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Body parts behaviour 
const BODY_PARTS_BEHAVIOURS ="sycamore-body-parts/" // Application ID
function body_parts() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(BODY_PARTS_BEHAVIOURS + "Body parts lesson"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Meditation behaviours 
const MEDITATION_BEHAVIOURS ="sycamore-meditation/" // Application ID
function breathing() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(MEDITATION_BEHAVIOURS + "Breathing"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Meditation -- Imagination 
function imagination() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(MEDITATION_BEHAVIOURS + "Imagination"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Celebration dance behaviour
const Dance ="sycamore-dance/" // Application ID
function celebration() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "Celebration"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

// Cotton-eye joe 
function cotton_eye() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "Cotton-Eye Joe"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Ghostbusters 
function ghostbusters() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "Ghostbusters"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Happy
function happy() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "Happy"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Gotta feeling
function gotta_feeling() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "I Gotta Feeling"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Macarena
function macarena() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "Macarena"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// One more time 
function one_more_time() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "One More Time"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Titanium
function titanium() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Dance + "Titanium"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}

const Jokes ="sycamore-jokes/" // Application ID
function jokes() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(Jokes + "jokes controls"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}
// Bad day 
const BAD_Day ="sycamore-bad-day/" // Application ID
function bad_day() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(BAD_Day + "BAD_Day"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
} 
// Fun facts   
const FUN_FACTS ="sycamore-fun-facts/" // Application ID
function fun_facts() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(FUN_FACTS + "Fun Facts"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
}    
// Games
const GAMES_ROOM ="sycamore-games/" // Application ID
function games_room() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(GAMES_ROOM + "games"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
} 
 // Natalie story 
const NATALIE_STORY ="sycamore-superhero-story/" // Application ID
function superpower() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(NATALIE_STORY + "superhero"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
} 
// Choose your own adventure
const CHOOSE_YOUR_OWN_ADVENTURE ="sycamore-choose-your-own-adventure/" // Application ID
function adventure() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(CHOOSE_YOUR_OWN_ADVENTURE + "ChooseYourOwnAdventure"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
} 

const MATHS ="sycamore-maths/" // Application ID
function maths() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(MATHS + "maths"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
} 

const ZONES ="sycamore-zones/" // Application ID
function zones() { // Function name to be called in the event handler.
  session.service("ALBehaviorManager").done(function(bm) {
      bm.startBehavior(ZONES + "Zones of Regulation"); // Behaviour name
  }).fail(function(error) {
      console.log("An error occurred:", error);
  });
} 