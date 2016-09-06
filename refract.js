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
    return PlayersList.find({}, { //publish only the players with the top 5 scores
      sort: { score: 1 },
      limit: 5
    });
  });

  Meteor.publish('meAsAPlayer', function(){
    return PlayersList.find({createdBy: this.userId}, //publish only my top 5 scores
      {
        sort: {score: 1},
        limit: 5
      }
    );
  });

}

if(Meteor.isClient){

  plano = ["6/5+3", "6/4-3","6/4-3"];
  negativeNetDiopterArray = [-0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0, -2.25, -2.5, -2.75, -3.0, -3.25, -3.5, -3.75, -4.0, -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75, -6.0, -6.25, -6.5, -6.75, -7.0, -7.25, -7.5, -7.75, -8.0];
  positiveNetDiopterArray = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0];
  positiveSnellen1 = ["6/5+3", "6/5-2", "6/6-2","6/9+2", "6/12+1", "6/18+2", "6/24+2", "6/24+2", "6/36+2", "6/36-1", "6/48+2", "6/48", "6/60", "6/60", "6/60", "6/60", "3/36", "3/36", "3/36", "3/36", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "2/60", "2/60", "2/60", "2/60"];
  positiveSnellen2 = ["6/4-3", "6/5-1","6/6+1","6/9","6/12","6/18","6/24","6/24-3","6/36+1","6/36-2","6/48+1","6/48","6/60", "6/60", "6/60", "6/60", "3/36", "3/36", "3/36", "3/36", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "2/60", "2/60", "2/60", "2/60"];
  positiveSnellen3 = ["6/5+2","6/6+3","6/6-3","6/9-3","6/12-3","6/18-2","6/24-1","6/36+2","6/36","6/48+2","6/48", "6/48", "6/60", "6/60", "6/60", "6/60", "3/36", "3/36", "3/36", "3/36", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "2/60", "2/60", "2/60", "2/60"];
  negativeSnellen1 = ["6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3"];
  negativeSnellen2 = ["6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3"];
  negativeSnellen3 = ["6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2"];

  Meteor.subscribe('thePlayers');
  Meteor.subscribe('meAsAPlayer');

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
      return PlayersList.find({}, { ///mirrored query from server
        sort: { score: 1 },
        limit: 5
      });
      },
      'measplayer' : function(){ //mirrored query from server
        var currentUserId = Meteor.userId();
        return PlayersList.find({createdBy: currentUserId},
          {
            sort: {score: 1},
            limit: 5
          }
        );
      },
      'dateformat': function(datetoformat){
          var newdate = new Date(datetoformat);
          var newDateString = newdate.toLocaleDateString();
          var newTimeString = newdate.toLocaleTimeString();
          return newDateString + ' ' + newTimeString;
      },
      'trophycolor': function(index){
        if (index == 0) {
          return "<i class='fa fa-trophy' aria-hidden='true' style='color: #FFD700;' ></i>"; //gold
        }
        if (index == 1) {
          return "<i class='fa fa-trophy' aria-hidden='true' style='color: #C0C0C0;' ></i>"; //silver
        }
        if (index == 2) {
          return "<i class='fa fa-trophy' aria-hidden='true' style='color: #FF7F00;' ></i>"; //bronze
        } else {
          return "<i class='fa fa-trophy' aria-hidden='true' style='color: #FF7F00; opacity: 0;' ></i>"; //transparent
        }

      }
  });


  Template.refract.rendered = function(){
    if (!this._rendered) {
      Session.set('positiveLensNumber', 0);
      Session.set('negativeLensNumber', 0);
      Session.set('numberOfLensesLeft', 5);
      updateLabel = this.find('#updateLabel');
      canvas = this.find('#specsCanvas');
      queue = new createjs.LoadQueue(true);
      snellenImage = new Image();
      snellenImage.src = "/img/snellen.png";
      queue.on('fileload', thisImageHasLoaded);
      queue.on('complete', allImagesNowLoaded, this);
      queue.loadManifest([{id:'snellen_chart', src:"/img/snellen.png"}, {id:'animationspecs', src:"/img/optometry_specs_blocked.png"}, {id:'baizeTray', src:"/img/woodframe.png"}, {id: 'plusLens', src:"/img/plus-lens.png"}, {id:'restartbutton', src:"/img/restartbutton.png" }], true);
    }
  }

  Template.refract.events({
    'click .reset': function(){
      restart();
    }
  });

}

//// javascript

function thisImageHasLoaded(event){
  if (event.item.id == "snellen_chart") {
    snellen_chart = new createjs.Bitmap(event.result);
    snellen_chart.clone();
  }
  if (event.item.id == "animationspecs") {
    animationspecs = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'baizeTray') {
    baizeTray = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'plusLens') {
    plusLensLife = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'restartbutton') {
    restartbutton = new createjs.Bitmap(event.result);
  }
}

function allImagesNowLoaded(event){
    window.addEventListener('resize', resize, false);
    init();
}

function loadDefinitions(){

    slideSound = createjs.Sound.registerSound({id:"soundId", src:"/sounds/slidesound.mp3"});

    /*
    clock = $('.count-down').FlipClock({
                            clockFace: 'MinuteCounter',
                            autoStart: false
                        });
                        */

    stage = new createjs.Stage(canvas);
    subStage = new createjs.Container();

    snellen_text = new createjs.Text("6/6", "64px Oxygen Mono", "#303030");
    lensContainer = new createjs.Container();
    positiveText = new createjs.Text("Positive Diopter lenses","18px Oxygen Mono", "#9999FF");
    negativeText = new createjs.Text("Negative Diopter lenses","18px Oxygen Mono", "#9999FF");

    clockText = new createjs.Text(" ", "28px Oxygen Mono", "#303030");
    clockText.addEventListener('tick', updateClock);

    lensesLeftContainer = new createjs.Container();
    diopterTotalText = "0 Ds total"
    diopterTotalLabel = new createjs.Text(diopterTotalText, "28px Oxygen Mono", "#303030");
  //  diopterTotalLabel.textAlign = "center";
  //  diopterTotalLabel.textBaseline = "middle";

    directionsLabel = new createjs.Text("The clock will start when you place your first lens...", "28px Bungee Shade", "#303030");


    started = false;
    startTime = new Date();
    addition = true;
    diopters = 0;
    netDiopters = 0;
    firstTime = true;
    myTotalDiopters = 0;
    diopters = ["-4.0", "-2.0","-1.0","-0.5", "-0.25", "+4.0","+2.0", "+1.0", "+0.5", "+0.25" ];
    update = true;
    fadeFlag = false;
    lensInPlace = false;
    updateScreenSize = true;
}

function resize(){

  updateScreenSize = true;

   var gameArea = document.getElementById('canvascontainer');
    var widthToHeight = 1.7;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    var contentSize = subStage.getBounds();

    if (newWidth < contentSize.width) {
      var scale = newWidth/contentSize.width;
      subStage.scaleX = subStage.scaleY = scale;
      stage.update();
    }

    if (newHeight < contentSize.height) {
      var scale = newHeight/contentSize.height;
      subStage.scaleX = subStage.scaleY = scale;
      stage.update();
    }


    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    var gameCanvas = document.getElementById('specsCanvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;


 }

function init(){
  //check and see if the canvas element is supported in
            //the current browser
            //http://diveintohtml5.org/detect.html#canvas
            if(!(!!document.createElement('canvas').getContext))
            {
                var wrapper = document.getElementById("canvasWrapper");
                wrapper.innerHTML = "Your browser does not appear to support " +
                "the HTML5 Canvas element";
                return;
            }
  loadDefinitions();
  window.addEventListener('resize', resize, false);
  setTheStage();
  addTheLenses();
  resize();
  var myPatient = selectPatient();
  Session.set('myPatient', myPatient);
  updateTheScores(0);
}

function setTheStage(){

  // create stage and point it to the canvas:

  createjs.Touch.enable(stage);
  stage.enableMouseOver(10);
  stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

 //sizes
  var stageWidth = stage.canvas.width;
  var animationspecsSize = animationspecs.getBounds();
  var clockTextSize = clockText.getBounds();
  var snellenTextSize = snellen_text.getBounds();
  var snellen_chart_size = snellen_chart.getBounds();
  var baizeTrayDimensions = baizeTray.getBounds();

  //add the directionsLabel
  directionsLabel.x = 0; directionsLabel.y = 0;
  subStage.addChild(directionsLabel); ////NEW

  //add the baize

  baizeTray.x = 0;
  baizeTray.y = snellenTextSize.height;

  subStage.addChild(baizeTray); ///NEW

  //add the snellen chart

  snellen_chart.x = baizeTrayDimensions.x + baizeTrayDimensions.width + 80;//80px padding for blur outline
  snellen_chart.y = snellenTextSize.height + 80; //80px padding for blur outline

  subStage.addChild(snellen_chart); //NEW

  //add the specs

  animationspecs.x = baizeTrayDimensions.width - animationspecsSize.width;
  animationspecs.y = baizeTrayDimensions.height + baizeTray.y;
  subStage.addChild(animationspecs); //NEW


  //add the hit area
  hitArea = new createjs.Shape();
  hitArea.graphics.beginFill("FFF").drawCircle(100,100,50);
  hitArea.x = animationspecs.x + 30;
  hitArea.y = animationspecs.y + 60;
  animationspecs.hitArea = hitArea;
  subStage.addChild(hitArea); //NEW
  hitArea.alpha = 0;

  //add the snellen text

  snellen_text.y = baizeTray.y + baizeTrayDimensions.height;
  snellen_text.x = snellen_chart.x + snellen_chart_size.width + 80; //padding for blur

  subStage.addChild(snellen_text); //NEW

  // add the diopterTotalLabel

  diopterTotalLabel.x = animationspecs.x + ((animationspecsSize.width - diopterTotalLabel.getBounds().width)/2);
  diopterTotalLabel.y = snellen_chart.y + snellen_chart_size.height;
  subStage.addChild(diopterTotalLabel); //NEW

  // add the clock

  clockText.x = snellen_chart.x + snellen_chart_size.width + 60; //padding for blur
  clockText.y = snellen_chart. y + snellen_chart_size.height;
  subStage.addChild(clockText); //new

  stage.addChild(subStage); //NEW

  stage.update();
}

function addTheLenses(){
  //add the lenses

  var myMinusLens = new Image();
  myMinusLens.src = "/img/minus-lens.png";
  var myPlusLens = new Image();
  myPlusLens.src = "/img/plus-lens.png";

  myMinusLens.tag = "minus";
  myPlusLens.tag = "plus";

  myPlusLens.onload = handleLensImageLoad;
  myMinusLens.onload = handleLensImageLoad;

  stage.update();
}

function updateClock(tick){
  if (started) {
    var now = new Date().getTime();
    var newTime = ((now - startTime)/1000).toFixed(3);
    var newTimeString = newTime.toString();
    clockText.text =  newTimeString + " seconds";
  }
}

function handleLensImageLoad(event){
    var image = event.target;
    var startOfArray = 0;
    var isPlusLens = false;

    if (image.tag == 'minus') {

    }

    if (image.tag == "plus") {
        isPlusLens = true;
        startOfArray = 5; //relates to diopter array to label the positive lenses with positive diopter values
        var numberOfLensesLeft = Session.get('numberOfLensesLeft');
        // these will be the number of lenses lensesLeftContainer
        for (var l = 0; l < numberOfLensesLeft + 1; l++) {
          lensLeftContainer = new createjs.Container();
          var lensLeft = new createjs.Bitmap(image);
          var lensLeftNumber = new createjs.Text(l+1, "48px Bungee Shade", "#303030");
          var lensLeftSize = lensLeft.getBounds();
          var lensLeftNumberSize = lensLeftNumber.getBounds();
          var diopterTotalLabelSize = diopterTotalLabel.getBounds();
          var whiteCircle = new createjs.Shape();
          whiteCircle.graphics.beginFill("white").drawCircle(0, 0, lensLeftNumberSize.height/2) + 5;

          if (l < numberOfLensesLeft) {
            lensLeftNumber.x = lensLeft.x + ((lensLeftSize.width - lensLeftNumberSize.width)/ 2)+2.5;
            lensLeftNumber.y = lensLeft.y + 35 +(l*30);
            lensLeft.y = lensLeft.y + (l*30);
            whiteCircle.x = lensLeft.x + (lensLeftSize.width/2) + 5;
            whiteCircle.y = lensLeft.y + (lensLeftSize.height/2);
            lensLeftContainer.name = "lensLeftContainer"+l; //this becomes the identifier for each lens in the lensesLeftContainer

            lensLeftContainer.addChild(lensLeft);
            lensLeftContainer.addChild(whiteCircle);
            lensLeftContainer.addChild(lensLeftNumber);
          } else {
            /*
            //this lens has the diopter totals

            lensLeft.y = lensLeft.y + 70 +(l*30);
            whiteCircle.x = lensLeft.x + (lensLeftSize.width/2) + 5;
            whiteCircle.y = lensLeft.y + (lensLeftSize.height/2);
            whiteCircleSize = whiteCircle.getBounds();
            lensLeftContainer.name = "diopterTotalLabel"; //this becomes the identifier for the diopter total lens in the lensesLeftContainer
            diopterTotalLabel.x = lensLeft.x + ((lensLeftSize.width/2));
            diopterTotalLabel.y = lensLeft.y + ((lensLeftSize.height/2));

            lensLeftContainer.addChild(lensLeft);
            lensLeftContainer.addChild(whiteCircle);
            lensLeftContainer.addChild(diopterTotalLabel);
            */

          }

          lensesLeftContainer.addChild(lensLeftContainer);

        }
        var baizeTrayDimensions = baizeTray.getBounds();
        lensesLeftContainer.x = baizeTray.x;
        lensesLeftContainer.y = baizeTray.y + baizeTrayDimensions.height;
        subStage.addChild(lensesLeftContainer); //NEW

        // add the restart button
        restartbutton.name = 'restartbutton';
        restartbutton.x = snellen_chart.x +  snellen_chart.getBounds().width + 80;
        restartbutton.y = baizeTray.y + (restartbutton.getBounds().height/2);
        subStage.addChild(restartbutton); //needs listeners /// NEW

        //label for when no lenses left in lensesLeftContainer
        noLenses = new createjs.Text("Remove a Lens!", "18px Bungee Shade", "red");
        noLenses.alpha = 0;
        noLensesLength = 200;
        lensesLeftContainerSize = lensesLeftContainer.getBounds();
        noLenses.x = lensesLeftContainer.x;
        noLenses.y = lensesLeftContainer.y;
        subStage.addChild(noLenses); //NEW

    }

   createjs.Ticker.addEventListener("tick", tick);

   restartbutton.regX = restartbutton.getBounds().width / 2 | 0;
   restartbutton.regY = restartbutton.getBounds().height / 2 | 0;
   restartbutton.scaleX = restartbutton.scaleY = restartbutton.scale = 1;
   restartbutton.cursor = "pointer";

   restartbutton.on("rollover", function (evt) {
       this.scaleX = this.scaleY = this.scale * 1.2;
       update = true;
   });

   restartbutton.on("rollout", function (evt) {
       this.scaleX = this.scaleY = this.scale;
       update = true;
   });
   restartbutton.on("click", function(evt){
     restart();
   });

    for (var k=0; k<5; k++){ //the number of each lens
        for (var i = startOfArray; i < startOfArray+5; i++) {
                bitmap = new createjs.Bitmap(image);
                lensContainer = new createjs.Container();
                subStage.addChild(lensContainer); //NEW
                lensContainer.addChild(bitmap);

                myText=diopters[i]; //retrieve the lens strengths

                var nextLabelText = new createjs.Text(myText,"12px Courier","#FFFFFF");
                nextLabelText.rotation = 40;

                    var lensWidth = bitmap.image.width;
                    var lensHeight = bitmap.image.height;

                     //add text labels to the lenses

                    if (!isPlusLens) {

                        nextLabelText.x = 25;
                        nextLabelText.y = 15;
                    }
                    else{

                        nextLabelText.rotation = 140;
                        nextLabelText.x = 55;
                        nextLabelText.y = 85;

                    }

                lensContainer.addChild(nextLabelText);

                //container.addChild(lensContainer);
                lensContainer.mouseChildren=false;

                //rotate then place the lens container
                var baizeTrayDimensions = baizeTray.getBounds();

                lensContainer.x = baizeTray.x + (image.width * (i + 1)/1.3) + 40;
                lensContainer.y = baizeTray.y + 125;

                if (isPlusLens) {
                    lensContainer.x = baizeTray.x + image.width * (i-4)/1.3 + 40;
                    lensContainer.y = baizeTray.y + (baizeTrayDimensions.height - 125);
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

                    //the frame dims when lens is over it
                   this.x = evt.stageX + this.offset.x;
                  this.y = evt.stageY + this.offset.y;
                // indicate that the stage should be updated on the next tick:
                  //  animationspecs.alpha = 1.0;
                    var pt = hitArea.globalToLocal(evt.stageX, evt.stageY);

                    if (hitArea.hitTest(pt.x, pt.y)) {
                        animationspecs.alpha = 0.2;
                        lensInPlace = true;
                    } else {
                      animationspecs.alpha = 1.0;
                      lensInPlace = false;
                    }

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
                    var numberOfLensesLeft = Session.get('numberOfLensesLeft');
                    evt.target.mouseEnabled = false;

                    if (lensInPlace) {
                        //start the clock if this is the first time
                        if (firstTime) {
                            started = true;
                            startTime = new Date().getTime();
                            firstTime = false;
                            fadeDirections(true);
                        };
                        if (numberOfLensesLeft < 1) {
                          update = true;
                          returnLensToOrigin(evt);
                          lensInPlace = false;
                          evt.target.lensInPlace = false;
                          animationspecs.alpha = 1.0;
                          return;
                        }
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
                    } else {
                      //lens is not in place
                      returnLensToOrigin(evt);
                      if (evt.target.lensInPlace == true) {
                        // this lens has been removed from the frame
                        evt.target.lensInPlace = false; //this lens is no longer in place
                        // add the lensesLeftContainer lens back

                        numberOfLensesLeft = parseInt(numberOfLensesLeft) + 1;
                        Session.set('numberOfLensesLeft', numberOfLensesLeft);

                        // animate lens back to lensesLeftContainer
                        addLensBackToLensesLeftContainer(numberOfLensesLeft-1);

                        var lensValue = parseFloat(evt.target.diopter);
                        myTotalDiopters = updateTheLensTotals(lensValue, myTotalDiopters, false)
                        updateTheScores(myTotalDiopters);
                        //animate the lens back
                      }
                    }
                });
        }
    }
}

function nudgeLensIntoPlace(event){
    createjs.MotionGuidePlugin.install();

    var dioptersOfThisLens = event.target.diopter;
    //lens must rotate and final position moves depending on if positive or negative
    var finalPositionX = hitArea.x+95;
    var finalPositionY = hitArea.y+100;
    var lensRotation=   0; //45 + (dioptersOfThisLens * 100);
    var numberOfNegativeLenses = Session.get('negativeLensNumber');
    var numberOfPositiveLenses = Session.get('positiveLensNumber');
    var numberOfLensesLeft = Session.get('numberOfLensesLeft');

    numberOfLensesLeft = numberOfLensesLeft - 1;
    Session.set('numberOfLensesLeft', numberOfLensesLeft);
    // animate disappearance of lens from lensesLeftContainer
    removeLensFromLensesLeftContainer(numberOfLensesLeft);

    if (event.target.diopter>0) {

        numberOfPositiveLenses = numberOfPositiveLenses + 1;
        Session.set('positiveLensNumber', numberOfPositiveLenses);
        lensRotation = numberOfPositiveLenses * 20;
    //    if (numberOfPositiveLenses == 5) {
    //      console.log('this is your last lens');
    //    }

        var finalPositionX = hitArea.x+95;
        var finalPositionY = hitArea.y+100;
    } else {
      numberOfNegativeLenses = numberOfNegativeLenses + 1;
      Session.set('negativeLensNumber', numberOfNegativeLenses);
      lensRotation = numberOfNegativeLenses * -20;
      //  if (numberOfNegativeLenses == 5) {
      //    console.log('this is your last lens');
      //  }

    }


    createjs.Tween.get(event.target).to({x:finalPositionX, y:finalPositionY},500,createjs.Ease.linear).to({rotation: lensRotation }, 1000, createjs.Ease.linear).call(nudgeComplete);
    update = true;

    createjs.Ticker.addEventListener("tick", stage);
}

function nudgeComplete(event){
  event.target.mouseEnabled=true;
}

function returnLensToOrigin(event){

  var lensToReturn = event.target;

  var numberOfNegativeLenses = Session.get('negativeLensNumber');
  var numberOfPositiveLenses = Session.get('positiveLensNumber');

    createjs.MotionGuidePlugin.install();

    if (event.target.diopter > 0) {
      // positive lens
      numberOfPositiveLenses = numberOfPositiveLenses -1;
      Session.set('positiveLensNumber', numberOfPositiveLenses);
    }
    if (event.target.diopter < 0) {
      //negative lens
      numberOfNegativeLenses = numberOfNegativeLenses - 1;
      Session.set('negativeLensNumber', numberOfNegativeLenses);
    }

    //lens must rotate depending on if positive or negative
    var lensRotation=0;

    createjs.Tween.get(event.target).to({ guide:{path:[event.target.x, event.target.y, event.target.x+200, event.target.y+200, event.target.originalX, event.target.originalY] }},500).to({rotation: lensRotation }, 1000, createjs.Ease.linear);
    update = true;

    createjs.Ticker.addEventListener("tick", stage);
console.log(event.target.id);
    event.target.mouseEnabled = true;
}

function removeLensFromLensesLeftContainer(lensToRemove){
  var lensContainerName = "lensLeftContainer"+lensToRemove;
  var lensToRemoveFromContainer = lensesLeftContainer.getChildByName(lensContainerName);
  createjs.Tween.get(lensToRemoveFromContainer, {loop: false}).to({alpha: 0}, 500, createjs.Ease.getPowInOut(2)).call(lensRemovedFromLensLeftContainer(lensToRemove));
  fadeFlag = true;
  createjs.Ticker.addEventListener("tick", tick);
}

function addLensBackToLensesLeftContainer(lensToAdd){
  var lensContainerName = "lensLeftContainer"+lensToAdd;
  var lensToAddBackToContainer = lensesLeftContainer.getChildByName(lensContainerName);
  createjs.Tween.get(lensToAddBackToContainer, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2)).call(lensAddedBackToLensesContainer(lensToAdd));
  fadeFlag = true;
  createjs.Ticker.addEventListener("tick", tick);
}

function lensRemovedFromLensLeftContainer(lensToRemove){
  if (parseInt(lensToRemove) == 0) {

    createjs.Tween.get(noLenses, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2)); //fade in no lenses warning
    fadeFlag = true;
    createjs.Ticker.addEventListener("tick", tick);
  }
}

function lensAddedBackToLensesContainer(lensAdded){
  if (lensAdded  == 0) {

    createjs.Tween.get(noLenses, {loop: false}).to({alpha: 0}, 500, createjs.Ease.getPowInOut(2)); // fade out no lenses warning
    fadeFlag = true;
    createjs.Ticker.addEventListener("tick", tick);
  }
}

function tick(event) {
    if (updateScreenSize) {
      updateScreenSize = false;
      stage.update(event);
    }

    if (fadeFlag) {
      fadeFlag = false;
      stage.update(event);
    }

    // this set makes it so the stage only re-renders when an event handler indicates a change has happened

    if (update) {
        update = false; // only update once
        stage.update(event);
    }



}

function handleComplete(evt){
    stage.update();
}

function selectPatient(){
  var longrefraction = 0;
  do {
    longrefraction=Math.random()*(8+8+1)-8;
  } while (longrefraction == 0);

    var inquarters =  Math.round(longrefraction * 4) / 4;
    return inquarters.toFixed(2);
}

function fadeDirections(fade){

  if (fade) {
    createjs.Tween.get(directionsLabel, {loop: false}).to({alpha: 0}, 500, createjs.Ease.getPowInOut(2));
    fadeFlag = true;
    createjs.Ticker.addEventListener("tick", tick);
  } else {
    createjs.Tween.get(directionsLabel, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2));
    fadeFlag = true;
    createjs.Ticker.addEventListener("tick", tick);
  }

    /*

    var box = bootbox.alert("The clock will start when you place your first lens. Good Luck!");

    setTimeout(function() {
    // be careful not to call box.hide() here, which will invoke jQuery's hide method
        box.modal('hide');
    }, 2000);
    */
}

function updateTheLensTotals(lensValue, runningTotal, Add){
    var totalLensValue = 0;

    if (Add==true) {
            totalLensValue = lensValue + runningTotal;
    }
    else{
            totalLensValue = runningTotal - lensValue;
    }

    diopterTotalText = totalLensValue + " Ds total"

    if (totalLensValue % 1 === 0) {
      diopterTotalText = totalLensValue + ".00 Ds total"
    }
    if (totalLensValue % 1 === -0.5 || totalLensValue % 1 === 0.5) {
      diopterTotalText = parseInt(totalLensValue) + ".50 Ds total"
    }

    diopterTotalLabel.text = diopterTotalText;
    diopterTotalLabel.x = animationspecs.x + ((animationspecs.getBounds().width - diopterTotalLabel.getBounds().width)/2);

    return totalLensValue;
}

function updateTheScores(lensesTotals){

  var patient = Session.get('myPatient');

    netDiopters = parseFloat(patient) + parseFloat(lensesTotals); //this is the degree of blur unless overplussed

    var myPrescription = parseFloat(patient)*-1;

    var snellenString = snellenFromDiopters(netDiopters); //this is the snellen value if not overplussed/minussed

    blurSnellenChart(netDiopters);
    snellen_text.text = snellenString;
    stage.update();

    if(netDiopters==0.0){
      // you have won!

        started = false;
        var time = clockText.text;
        showTheDialog(time);
    }
}

function snellenFromDiopters(diopterValue){

  /*
    var s = Math.pow(10, ((diopterValue / 2) + 1.25));
    var sm = s * 0.3048; //convert feet to metres
    return Math.round(sm);
    */
    var indexOfRefractiveError = 0;

  var snellenArray = [];

  var random3 = Math.random()*(3-1)+1;

  if (diopterValue > 0) {
    // this is a positive refractive error (overplussed)
    indexOfRefractiveError = positiveNetDiopterArray.indexOf(diopterValue); // this is the index of the current refractive error with lenses

    //select at random one of 3 matching VAs for this refractive error
    switch (parseInt(random3)) {
      case 3:
        snellenArray = positiveSnellen3;
        break;
      case 2:
        snellenArray = positiveSnellen2;
        break;
      case 1:
        snellenArray = positiveSnellen1;
        break;
      default: console.log('i am default');
        break;
    }

    return snellenArray[indexOfRefractiveError];
  }
  if (diopterValue < 0) {
    // this is a negative refractive error - overminused
    indexOfRefractiveError = negativeNetDiopterArray.indexOf(diopterValue); // this is the index of the current refractive error with lenses
    switch (parseInt(random3)) {
      case 3:
        snellenArray = negativeSnellen3;
        break;
      case 2:
        snellenArray = negativeSnellen2;
        break;
      case 1:
        snellenArray = negativeSnellen1;
        break;
      default: console.log('i am default');
        break;
    }

    return snellenArray[indexOfRefractiveError];
  } else {
    //must be 0 refractive error
    var indexOfPlano = parseInt(random3);
    return plano[indexOfPlano];
  }

}

function blurSnellenChart(diopterValue){

  // 6/6 = 3/3/15
  // 6/6/2 = 6/9 = >0.75
  //8/8/2 = 6/12 = >1.0
  //9/9/3 = 6/18 = > 1.25
  //15/15/5 = 6/24 = > 1.5
  //20/20/5 = 6/36 = > 2.0
  //25/25/5 = 6/48 = > 2.5
  //35/35/5 = 6/60 = > 3
  // 45/45/5 = 3/36 = > 4
  //   55/55/5       = 3/60 = > 5
  //  65/65/5        = > 2/60 = > 7

  var blurFilter = new createjs.BlurFilter(3,3,15);

  if (diopterValue >= 0.75) {
    blurFilter = new createjs.BlurFilter(6,6,2);
  }
  if (diopterValue >= 1.0) {
    blurFilter = new createjs.BlurFilter(8,8,2);
  }
  if (diopterValue >= 1.25) {
    blurFilter = new createjs.BlurFilter(9,9,3);
  }
  if (diopterValue >= 1.5) {
    blurFilter = new createjs.BlurFilter(15,15,5);
  }
  if (diopterValue >= 2.0) {
    blurFilter = new createjs.BlurFilter(20,20,5);
  }
  if (diopterValue >= 2.5) {
    blurFilter = new createjs.BlurFilter(25,25,5);
  }
  if (diopterValue >= 3.0) {
    blurFilter = new createjs.BlurFilter(35,35,5);
  }
  if (diopterValue >= 4.0) {
    blurFilter = new createjs.BlurFilter(45,45,5);
  }
  if (diopterValue >= 5.0) {
    blurFilter = new createjs.BlurFilter(55,55,5);
  }
  if (diopterValue >= 7.0) {
    blurFilter = new createjs.BlurFilter(65,65,5);
  }
  if (diopterValue < 0.5) {
      blurFilter = new createjs.BlurFilter(0,0,2);
  }

  snellen_chart.filters = [blurFilter];
  var bounds = blurFilter.getBounds();
  snellen_chart.cache(-50, -50, snellenImage.width + 50, snellenImage.height + 50);
  stage.update();
}

function restart(){
    location.reload();
}

function showTheDialog(finalscore){

    bootbox.dialog({
        message:  'You managed to refract in '+ finalscore.toString()+ '. Click to save result',
        title: "Well done " + Meteor.user().profile.name,
        buttons:{
            success: {
                label: "Save Score",
                className: "btn-success",
                callback: function(){
                  PlayersList.insert({
                    createdBy: Meteor.userId(),
                    player_alias: Meteor.user().profile.name,
                    score: parseFloat(finalscore),
                    date: new Date().getTime()
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

    lensContainer.mouseChildren = false;
    lensContainer.removeAllEventListeners();

}

function dismiss(){
    lensContainer.mouseEnabled = false;


}
