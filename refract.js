PlayersList = new Mongo.Collection('players');

Router.configure({
  layoutTemplate : 'main'
});

Router.route('/refract');
Router.route('/contact');
Router.route('/about',{
  name:'about',
  template:'about'
});
Router.route('/', {
    name: 'home',
    template: 'home'
});
Router.route('/leaderboard', {
  name:'leaderboard',
  template: 'leaderboard'
});
Router.route('/rules',{
  name:'rules',
  template:'rules'
});

if (Meteor.isServer) {

  Accounts.onCreateUser(function(options, user) {
      if (options.profile) {
          user.profile = options.profile;
      }
      return user;
  });

  PlayersList.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */

      return true;
    }
  });

  Meteor.publish('thePlayers', function(){
    return PlayersList.find()
});

}

if(Meteor.isClient){

  Meteor.subscribe('thePlayers');

  accountsUIBootstrap3.logoutCallback = function(error) {
    if(error) console.log("Error:" + error);
    Router.go('home');
  }

  Template.navbaritemsleft.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
  });

  Template.navbaritemsright.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
      template === currentRoute.lookupTemplate() ? 'active' : '';
    }
  });
  
  Template.gamesdropdown.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
  });


  Accounts.ui.config({
    passwordSignupFields: "EMAIL_ONLY",
    extraSignupFields: [{
      fieldName: 'name',
      fieldLabel: 'First Name or Alias',
      inputType: 'text',
      visible: true,
      validate: function(value, errorFunction) {
        if (!value) {
          errorFunction("Please enter a name.");
          return false;
        } else {
          return true;
        }
      }
    }],
  requestPermissions: {
    facebook: []
  }
  });

  Template.leaderboard.helpers({
      'player' : function(){
        return PlayersList.find({}, {sort:{score: -1}})
      },
      'measplayer' : function(){
        var currentUserId = Meteor.userId();
        console.log(currentUserId);
        return PlayersList.find({createdBy: currentUserId})
      }
  });


  Template.refract.rendered = function(){
    if (!this._rendered) {
      updateLabel = this.find('#updateLabel');
      canvas = this.find('#specsCanvas');
      init();
    }
  }

  Template.refract.events({
    'click .go': function(event){
      go();

    },
    'click .reset': function(){
      restart();
    }
  });

}


//// javascript

function loadDefinitions(){
  //  addButton = document.getElementById("add");
  //  subtractButton = document.getElementById("subtract");
//    diopterLabel = document.getElementById("diopterlabel");

//    goButton = document.getElementById("gobutton");
    slideSound = createjs.Sound.registerSound({id:"soundId", src:"/sounds/slidesound.mp3"});
    snellen = new Image();
    snellen.src = "/img/snellen.png";
    blockedspecs = new Image();
    blockedspecs.src = "/img/optometry_specs_blocked.png";
    plusLens = new Image();
    plusLens.src = "/img/plus-lens.png";
    minusLens = new Image();
    minusLens.src = "/img/minus-lens.png";

    clock = $('.count-down').FlipClock({
                            clockFace: 'MinuteCounter',
                            autoStart: false
                        });
    stage = new createjs.Stage(canvas);
    snellen_chart = new createjs.Bitmap(snellen);
    snellen_text = new createjs.Text("6/6", "32px Arial", "#9999FF");
    snellen_container = new createjs.Container();
    animationspecs = new createjs.Bitmap(blockedspecs);
    lensContainer = new createjs.Container();
    positiveText = new createjs.Text("Positive Diopter lenses","18px Arial", "#9999FF");
    negativeText = new createjs.Text("Negative Diopter lenses","18px Arial", "#9999FF");


    addition = true;
    myPatient = 0;
    diopters = 0;
    netDiopters = 0;
    firstTime = true;
    myTotalDiopters = 0;
    diopters = ["-4.0", "-2.0","-1.0","-0.5", "-0.25", "+4.0","+2.0", "+1.0", "+0.5", "+0.25" ];
    update = true;
    lensInPlace = false;

}

function handleImageLoad(event){
    var image = event.target;
    var startOfArray = 0;
    var isPlusLens = false;
    if (image.tag == "plus") {
        isPlusLens = true;
        startOfArray = 5;
    }

   createjs.Ticker.addEventListener("tick", tick);

    for (var k=0; k<5; k++){ //the number of each lens
        for (var i = startOfArray; i < startOfArray+5; i++) {
                bitmap = new createjs.Bitmap(image);
                lensContainer = new createjs.Container();
                stage.addChild(lensContainer);
                lensContainer.addChild(bitmap);

                myText=diopters[i]; //retrieve the lens strengths
              //  lensContainer.name = myText; //the container containes the lens image and the labels

                var nextText = new createjs.Text(myText,"12px Courier","#FFFFFF");
                var nextUpsideDownText = new createjs.Text(myText,"12px Courier","#FFFFFF");
                nextUpsideDownText.rotation = 180;

                    var lensWidth = bitmap.image.width;
                    var lensHeight = bitmap.image.height;

                     //add text labels to the lenses

                    if (!isPlusLens) {
                        nextText.x = lensWidth/2;
                        nextText.y = 5;
                        nextUpsideDownText.x = lensWidth/2 + 37.5;
                        nextUpsideDownText.y = lensHeight - 2.5;
                    }
                    else{
                        nextText.x = 32.5;
                        nextText.y = 5;
                        nextUpsideDownText.x = lensWidth/2;
                        nextUpsideDownText.y = lensHeight - 2.5;
                    }

                lensContainer.addChild(nextText);
                lensContainer.addChild(nextUpsideDownText);

                //container.addChild(lensContainer);
                lensContainer.mouseChildren=false;

                //rotate then place the lens container

                lensContainer.x = image.width/1.3 * i;
                lensContainer.y = 60;

                lensContainer.rotation = 45;
                if (isPlusLens) {
                    lensContainer.rotation = 135;
                    lensContainer.x = image.width/1.3 * (i-5);
                    lensContainer.y += lensContainer.getBounds().width;
                };


                lensContainer.regX = lensContainer.getBounds().width / 2 | 0;
                lensContainer.regY = lensContainer.getBounds().height / 2 | 0;
                lensContainer.scaleX = lensContainer.scaleY = lensContainer.scale = 1;
                lensContainer.cursor = "pointer";
                lensContainer.originalX = lensContainer.x;
                lensContainer.originalY = lensContainer.y;
                lensContainer.diopter = myText;
                lensContainer.lensInPlace = false;


                // using "on" binds the listener to the scope of the currentTarget by default
                // in this case that means it executes in the scope of the button.

                lensContainer.on("mousedown", function (evt) {

                    this.parent.addChild(this);
                    this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};

                });


                // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
                lensContainer.on("pressmove", function (evt) {


                   this.x = evt.stageX + this.offset.x;
                  this.y = evt.stageY + this.offset.y;
                // indicate that the stage should be updated on the next tick:
                    animationspecs.alpha = 1.0;
                    var pt = hitArea.globalToLocal(evt.stageX, evt.stageY);

                    if (hitArea.hitTest(pt.x, pt.y)) {
                        animationspecs.alpha = 0.2;
                        lensInPlace = true;
                    };

                    update = true;


                });

                lensContainer.on("rollover", function (evt) {
                    this.scaleX = this.scaleY = this.scale * 1.2;
                    update = true;
                });

                lensContainer.on("rollout", function (evt) {
                    this.scaleX = this.scaleY = this.scale;
                    update = true;
                });

                lensContainer.on("pressup", function(evt){
                    if (lensInPlace) {
                        //start the clock if this is the first time
                        if (firstTime) {
                            clock.start();
                            firstTime = false;
                        };
                        //this lens has been added
                        lensInPlace = false;
                        animationspecs.alpha = 1.0;
                        update = true;
                        evt.target.lensInPlace = true;
                        //update the lens totals
                        var lensValue = parseFloat(evt.target.diopter);
                        //update the scores
                        myTotalDiopters = updateTheLensTotals(lensValue, myTotalDiopters, true)
                        updateTheScores(myTotalDiopters);
                        //animate the lens into final position
                        nudgeLensIntoPlace(evt);
                    };
                });

                lensContainer.on("dblclick", function(evt){
                    if (evt.target.lensInPlace) {
                        console.log("doubleclicked in place");
                        evt.target.lensInPlace = false; //this lens is no longer in place
                        //update the scores
                        var lensValue = parseFloat(evt.target.diopter);
                        myTotalDiopters = updateTheLensTotals(lensValue, myTotalDiopters, false)
                        updateTheScores(myTotalDiopters);
                        //animate the lens back
                        returnLensToOrigin(evt);
                    }
                    else{
                        console.log("doubleclicked not in place");
                    }

                });

        }
    }

}

function nudgeLensIntoPlace(event){
    createjs.MotionGuidePlugin.install();

//lens must rotate and final position moves depending on if positive or negative
    var finalPositionX = hitArea.x+82.5;
    var finalPositionY = hitArea.y+92.5;
    var lensRotation=45;

    if (event.target.diopter>0) {
        lensRotation =135;
        var finalPositionX = hitArea.x+85;
        var finalPositionY = hitArea.y+120;
    };

    createjs.Tween.get(event.target).to({x:finalPositionX, y:finalPositionY},500,createjs.Ease.linear).to({rotation: lensRotation }, 1000, createjs.Ease.linear).call(moveComplete);
    update = true;
    createjs.Ticker.addEventListener("tick", stage);
}

function returnLensToOrigin(event){

    createjs.MotionGuidePlugin.install();

    //lens must rotate depending on if positive or negative
    var lensRotation=45;
    if (event.target.diopter>0) {

        lensRotation =135;
    };

    createjs.Tween.get(event.target).to({ guide:{path:[event.target.x, event.target.y, event.target.x+200, event.target.y+200, event.target.originalX, event.target.originalY] }},500).to({rotation: lensRotation }, 1000, createjs.Ease.linear).call(moveComplete);
    update = true;
    createjs.Ticker.addEventListener("tick", stage);
}
function moveComplete(){

}

function tick(event) {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened
    if (update) {
        update = false; // only update once
        stage.update(event);
    }

}

function init() {

    loadDefinitions();



    // create stage and point it to the canvas:

    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
    stage.canvas.width = screen.width - 200;
    stage.canvas.height = screen.height - 400;
    stage.x = 100;
    stage.y = 0;

    //add the snellen chart

    snellen_chart.scaleX = 0.75;
    snellen_chart.scaleY = 0.75;
    snellen_chart.x = (stage.canvas.width - 200) - snellen_chart.image.width;
    snellen_chart.y = 0;



    var snellen_chart_size = snellen_chart.getBounds();
    var snellen_text_size = snellen_text.getBounds();
    snellen_text.y = snellen_chart.y;
    snellen_text.x = snellen_chart.x + snellen_chart_size.width;
    snellen_container.addChild(snellen_chart);
    snellen_container.addChild(snellen_text);

    //add the snellen text

    positiveText.x = 5;
    positiveText.y = 5;


    //add the specs

    var stageWidth = stage.canvas.width;

    animationspecs.x = (stageWidth/2 - (animationspecs.image.width/2))-30;
    animationspecs.y = 220;

    hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("FFF").drawCircle(100,100,50);
    hitArea.x = animationspecs.x + 30;
    hitArea.y = animationspecs.y + 60;
    animationspecs.hitArea = hitArea;
    stage.addChild(hitArea);
    hitArea.alpha = 0;


    stage.addChild(animationspecs);
    stage.addChild(snellen_container);

    //add the lenses

    var myMinusLens = new Image();
    myMinusLens.src = "/img/minus-lens.png";
    var myPlusLens = new Image();
    myPlusLens.src = "/img/plus-lens.png";

    myMinusLens.tag = "minus";
    myPlusLens.tag = "plus";

    myPlusLens.onload = handleImageLoad;
    myMinusLens.onload = handleImageLoad;

   // stage.addChild(clock);

    stage.update();


}

function handleComplete(evt){
  //  evt.rotation = 180;

    stage.update();
}



function selectPatient(){
    var longrefraction=Math.random()*(8+8+1)-8;
    var inquarters =  Math.round(longrefraction * 4) / 4;
    return inquarters.toFixed(2);
}

function go(){
    init();
    myPatient = selectPatient();

    if (myPatient>=0){
        blur_image(snellen_chart, myPatient);
        updateTheScores(0);
    }
//    goButton.style.visibility = 'hidden';



    var box = bootbox.alert("The clock will start when you place your first lens. Good Luck!");

    setTimeout(function() {
    // be careful not to call box.hide() here, which will invoke jQuery's hide method
        box.modal('hide');
    }, 2000);



}

function updateTheLensTotals(lensValue, runningTotal, Add){
    var totalLensValue = 0;

    if (Add==true) {
            totalLensValue = lensValue + runningTotal;
    }
    else{
            totalLensValue = runningTotal - lensValue;
    }

    return totalLensValue;
}

function updateTheScores(lensesTotals){

    var patientrefraction = parseFloat(myPatient);

    netDiopters = parseFloat(myPatient) + parseFloat(lensesTotals); //this is the degree of blur unless overplussed or over minussed

    var myPrescription = parseFloat(myPatient)*-1;

    var snellenString = "6/"+snellenFromDiopters(netDiopters); //this is the snellen value if not overplussed/minussed

    if (myPrescription < 0 && lensesTotals < myPrescription) {
        // overminused: 6/5 +3
        snellenString = "6/5 +3";

    };
    if (myPrescription > 0 && lensesTotals > myPrescription) {
        //overplussed
        overPlussedDiopters = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50];
        overplussedSnellen = ["6/5 +3", "6/5 -2", "6/6 -2","6/9 +2", "6/12 +1", "6/18 +2", "6/24 +2", "6/24 +2", "6/36 +2", "6/36 -1", "6/48 +2" ];
        if (netDiopters<=2.5) {
            var indexOfDegreeOverPlussed = overPlussedDiopters.indexOf(netDiopters);
            snellenString = overplussedSnellen[indexOfDegreeOverPlussed];
        }
        else{
            snellenString = "whaaat??"
            console.log("way overplussed");
        }


    };

                //update the results (this will go in future)
    updateLabel.innerHTML= "{{ currentUser }}" + " has lenses which combine to "+ lensesTotals +" diopters." + " The patient's prescription is " + myPrescription + " ds.";
                //update the snellen chart
    blur_image(snellen_chart, netDiopters);

    snellen_text.text = snellenString;
    stage.update();

    if(netDiopters==0.0){

        clock.stop(function() {
            // this (optional) callback will fire after the clock stops
            var time = clock.getTime();
            showTheDialog(time);
        });
    }
}

function snellenFromDiopters(diopterValue){
    var s = Math.pow(10, ((diopterValue / 2) + 1.25));
    var sm = s * 0.3048; //convert feet to metres
    return Math.round(sm);
}

function blur_image(image, blur){

    if (blur > 0) {
        var blurFilter = new createjs.BlurFilter(blur,blur,2);
        image.filters = [blurFilter];
        var margins = blurFilter.getBounds();
        image.cache(0, 0, 400, 600);
        stage.update();
    }
    else{
        var blurFilter = new createjs.BlurFilter(0,0,2);
        image.filters = [blurFilter];
        var margins = blurFilter.getBounds();
        image.cache(0, 0, 400, 600);
        stage.update();
    }
}

function restart(){
    location.reload();
}

function showTheDialog(finalscore){

    bootbox.dialog({
        message:  'You managed to refract in '+ finalscore.toString()+ ' seconds. Click to save result',
        title: "Well done, " + Meteor.user().profile.name,
        buttons:{
            success: {
                label: "Save Score",
                className: "btn-success",
                callback: function(){
                  PlayersList.insert({
                    createdBy: Meteor.userId(),
                    player_alias: Meteor.user().profile.name,
                    score: finalscore.toString()
                  });
                }
            },
            main:{
            label: "Naw. Forget it.",
            className: "btn-primary",
            called: function(){
                  console.log('forgotten');
                }
            }
        }

    });

    stage.mouseChildren = false;
    stage.removeAllEventListeners();

}

function dismiss(){
    stage.mouseEnabled = false;
    console.log("dismissed");
}
