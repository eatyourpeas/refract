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

  PlayersList = new Mongo.Collection('players');

  Meteor.methods({
    addNewScore: function(finalscore){
      var newScore = PlayersList.insert({
        createdBy: Meteor.userId(),
        player_alias: Meteor.user().profile.name,
        score: parseFloat(finalscore),
        date: new Date().getTime(),
        topScore: false
      });

      return newScore;
    },

    updateTopScore: function(thisScoreId){
      var thisScore = PlayersList.findOne({_id:thisScoreId});
      var topScore = PlayersList.find({createdBy: Meteor.userId()},{sort: {score: 1}, limit: 1}).fetch();
      var lastTopScore = PlayersList.find({createdBy: Meteor.userId(), topScore: true}).fetch();
      if(lastTopScore.length > 0){ //there is a previous top score for this user
        console.log(topScore[0].score + ' currentscore: '+ thisScore.score);
        console.log(lastTopScore[0].topScore + ' score: '+lastTopScore[0].score);
        if (parseFloat(thisScore.score) <= parseFloat(topScore[0].score)) {
          console.log('this beats my top score - i must update');
          PlayersList.update(lastTopScore[0]._id, {$set:{topScore: false}}); //set last topscore to false
          PlayersList.update(thisScoreId, {$set:{topScore: true}}); //set new topscore to true
          return 'success top score';
        } else {
          console.log('this score does not beat my top score');
          return 'success personal list';
        }
      } else {
        //this is my first score
        PlayersList.update(thisScoreId, {$set:{topScore: true}}); //set new topscore to true
      }
    }

  });

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

      return PlayersList.find({topScore: true}, { //publish only the players with the top 15 scores
        sort: { score: 1 },
        limit: 15
      });


  });

  Meteor.publish('meAsAPlayer', function(){
    return PlayersList.find({createdBy: this.userId}, //publish only my top 5 scores
      {
        sort: {score: 1},
        limit: 15
      }
    );
  });



}

if(Meteor.isClient){

    plano = ["6/5+3", "6/4-3","6/4-3"];
    negativeNetDiopterArray = [-0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -1.75, -2.0, -2.25, -2.5, -2.75, -3.0, -3.25, -3.5, -3.75, -4.0, -4.25, -4.5, -4.75, -5.0, -5.25, -5.5, -5.75, -6.0, -6.25, -6.5, -6.75, -7.0, -7.25, -7.5, -7.75, -8.0, -8.25, -8.5, -8.75, -9.0];
    positiveNetDiopterArray = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25, 8.5, 8.75, 9.0];
    positiveSnellen1 = ["6/5-2", "6/6-2","6/9+2", "6/12+1", "6/18+2", "6/24+2", "6/24+2", "6/36+2", "6/36-1", "6/48+2", "6/48", "6/60", "6/60", "6/60", "6/60", "3/36", "3/36", "3/36", "3/36", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "2/60", "2/60", "2/60", "2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60"];
    positiveSnellen2 = ["6/5-1", "6/6+1", "6/9", "6/12", "6/18", "6/24", "6/24-3", "6/36+1", "6/36-2", "6/48+1", "6/48", "6/60", "6/60", "6/60", "6/60", "3/36", "3/36", "3/36", "3/36", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "2/60", "2/60", "2/60", "2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60"];
    positiveSnellen3 = ["6/6+3","6/6-3","6/9-3","6/12-3","6/18-2","6/24-1","6/36+2","6/36","6/48+2","6/48", "6/48", "6/60", "6/60", "6/60", "6/60", "3/36", "3/36", "3/36", "3/36", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "3/60", "2/60", "2/60", "2/60", "2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60", "<2/60"];
    negativeSnellen1 = ["6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3", "6/5+3"];
    negativeSnellen2 = ["6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3", "6/4-3"];
    negativeSnellen3 = ["6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2", "6/5+2"];

    PlayersList = new Mongo.Collection('players');

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
    }]
  });

  Template.leaderboard.helpers({
      'player' : function(){
        Meteor.subscribe('thePlayers');
        return PlayersList.find({topScore: true}, { ///mirrored query from server
          sort: { score: 1 },
          limit: 15
        });
      },
      'measplayer' : function(){ //mirrored query from server
        Meteor.subscribe('meAsAPlayer');
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

      },
      'oneDP': function(score){
        var onedp = score.toFixed(2);
        return onedp;
      }
  });


  Template.refract.rendered = function(){
    if (!this._rendered) {
      Session.set('positiveLensNumber', 0);
      Session.set('negativeLensNumber', 0);
      Session.set('numberOfLensesLeft', 5);
      Session.set('numberOfLevels', 3);
      Session.set('currentLevel', 1);
      Session.set('currentStage', 1);
      Session.set('levelErrorForIndex', 0);
      var timesArray = [];
      Session.set('timesArray', timesArray);
      updateLabel = this.find('#updateLabel');
      canvas = this.find('#specsCanvas');
      queue = new createjs.LoadQueue(true);
      snellenImage = new Image();
      snellenImage.src = "/img/snellen.png";
      queue.on('fileload', thisImageHasLoaded);
      queue.on('complete', allImagesNowLoaded, this);
      queue.loadManifest([
          {id:'snellen_chart', src:"/img/snellen.png"},
          {id:'animationspecs', src:"/img/optometry_specs_blocked.png"},
          {id:'baizeTray', src:"/img/woodframe.png"},
          {id: 'plusLens', src:"/img/plus-lens.png"},
          {id: 'plusLensHitArea', src:"/img/plus-lens-hitarea.png"},
          {id: 'minusLens', src:"/img/minus-lens.png"},
          {id: 'minusLensHitArea', src:"/img/minus-lens-hitarea.png"},
          {id:'restartbutton', src:"/img/restartbutton.png" },
          {id:"lensesused", src:"/img/lensesused.png"},
          {id:"lensesremaining", src:"/img/lensesremaining.png"},
          {id:"lensesremaining_black", src: "/img/lenses_remaining_black.png"},
          {id:"lensesused_black", src:"/img/lenses_used_black.png"},
          {id:"restart_black", src:"/img/restart_black.png"},
          {id: "submit_red", src:"/img/submit_red.png"},
          {id:"sugar_cane", src:"/img/sweet_sprites/sugar-cane.png"},
          {id:"sugar_cane_filled", src:"/img/sweet_sprites/sugar-cane_filled.png"},
          {id:"eye_candy_grey", src:"/img/sweet_sprites/icandy_grey.png"},
          {id:"eye_candy", src:"/img/sweet_sprites/icandy.png"},
          {id:"eye_candy_spritesheet", src:"/img/sweet_sprites/eye_candy_spritesheet.png"},
          {id:"blink001", src:"/img/sweet_sprites/Blink 00.png"},
          {id:"blink002", src:"/img/sweet_sprites/Blink 01.png"},
          {id:"blink003", src:"/img/sweet_sprites/Blink 02.png"},
          {id:"blink004", src:"/img/sweet_sprites/Blink 03.png"},
          {id:"blink005", src:"/img/sweet_sprites/Blink 04.png"},
          {id:"blink006", src:"/img/sweet_sprites/Blink 05.png"}
      ], true);
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
    plusLens = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'plusLensHitArea') {
    plusLensHitArea = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'minusLens') {
    minusLens = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'minusLensHitArea') {
    minusLensHitArea = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'restartbutton') {
    restartbutton = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'lensesremaining') {
    lensesremaining = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'lensesused') {
    lensesused = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'lensesused_black') {
    lensesused_black = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'lensesremaining_black') {
    lensesremaining_black = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'restart_black') {
    restartbutton_black = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'submit_red') {
    submitbutton = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'orange_yellow_candy') {
    orange_yellow_candy = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'yellow_orange_candy') {
    yellow_orange_candy = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'candy_spritesheet') {
    candy_spritesheet = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'sugar_cane') {
    sugar_cane = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'sugar_cane_filled') {
    sugar_cane_filled = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'blink001') {
    blink001 = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'blink001') {
    blink002 = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'blink001') {
    blink003 = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'blink001') {
    blink004 = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'blink001') {
    blink005 = new createjs.Bitmap(event.result);
  }
  if (event.item.id == 'eye_candy_spritesheet') {
    eye_candy_spritesheet = new createjs.Bitmap(event.result);
  }
}

function allImagesNowLoaded(event){
    window.addEventListener('resize', resize, false);
    init();
}

function loadDefinitions(){

    slideSound = createjs.Sound.registerSound({id:"soundId", src:"/sounds/slidesound.mp3"});
    createjs.MotionGuidePlugin.install();

    stage = new createjs.Stage(canvas);
    subStage = new createjs.Container();

    snellen_text = new createjs.Text("6/6", "28px Oxygen Mono", "#303030");
    lensContainer = new createjs.Container();
    positiveText = new createjs.Text("Positive Diopter lenses","18px Oxygen Mono", "#9999FF");
    negativeText = new createjs.Text("Negative Diopter lenses","18px Oxygen Mono", "#9999FF");

    clockText = new createjs.Text(" ", "24px Oxygen Mono", "#303030");
    clockText.addEventListener('tick', updateClock);

    lensesLeftContainer = new createjs.Container();
    diopterTotalText = "0.00 DS total";
    diopterTotalLabel = new createjs.Text(diopterTotalText, "24px Oxygen Mono", "#303030");
    directionsLabel = new createjs.Text("The clock will start when you place your first lens.\nClick submit when you have worked out the prescription.", "18px Oxygen Mono", "#303030");
    directionsLabel.lineHeight = 24;

    lensesUsedText = new createjs.Text("0", "24px Oxygen Mono", "#303030");
    lensesRemainingText = new createjs.Text("5", "24px Oxygen Mono", "#303030");
    lensesRemainingContainer = new createjs.Container();
    lensesUsedContainer = new createjs.Container();

    completedText = new createjs.Text("Well Done!", "48px Oxygen Mono", "white");
    completedSubText = new createjs.Text("Best of Three.", "24px Oxygen Mono", "white");
    completedTextContainer = new createjs.Container();

    eyeCandyText = new createjs.Text("Eye Candy", "24px Oxygen Mono", "#303030");
    allCandyContainers = new createjs.Container();

    allLensesContainer = new createjs.Container();

}

function setVariables(){
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
  blurTick = false;
  candyTick = false;
  lensesInPlace =[];
  candyContainers = [];
}

function resetVariables(){
  started = false;
  startTime = new Date();
  addition = true;
  diopters = 0;
  netDiopters = 0;
  firstTime = true;
  myTotalDiopters = 0;
  update = true;
  fadeFlag = false;
  lensInPlace = false;
  updateScreenSize = true;
  blurTick = false;
  candyTick = false;
  lensesInPlace =[];
}

function resize(){

  updateScreenSize = true;

   var gameArea = document.getElementById('canvascontainer');
    var widthToHeight = 1.5;
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
  setVariables();
  createjs.Ticker.addEventListener("tick", stage);
  window.addEventListener('resize', resize, false);
  setTheStage();
  addTheLenses();

  resize();
  var myPatient = selectPatient();
  Session.set('myPatient', myPatient);
  Session.set('');
  Session.set('attempts', 0);
  updateTheScores(0);
  stage.update();
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

  //add the baize

  baizeTray.x = 0;
  baizeTray.y = snellenTextSize.height;
  baizeTray.alpha = 1.0;

  subStage.addChild(baizeTray);

  //add the snellen chart

  snellen_chart.x = baizeTrayDimensions.x + baizeTrayDimensions.width + 80;//80px padding for blur outline
  snellen_chart.y = snellenTextSize.height + 80; //80px padding for blur outline
  snellen_chart.scaleX = snellen_chart.scaleY = 0.85;
  subStage.addChild(snellen_chart);

  //add the specs

  animationspecs.x = baizeTrayDimensions.width - animationspecsSize.width;
  animationspecs.y = baizeTrayDimensions.height + baizeTray.y;
  subStage.addChild(animationspecs);

  //add the hit area
  hitArea = new createjs.Shape();
  hitArea.graphics.beginFill("FFF").drawCircle(125,125,50);
  hitArea.x = animationspecs.x + 30;
  hitArea.y = animationspecs.y + 60;
  animationspecs.hitArea = hitArea;
  subStage.addChild(hitArea);
  hitArea.alpha = 0;

  //add the snellen text

  //snellenVAContainer.addChild(snellenTextBox);
 //  snellenVAContainer.addChild(snellen_text);
  snellen_text.y = baizeTray.y;
  snellen_text.x = snellen_chart.x + ((snellen_chart.getBounds().width/2) - snellen_text.getMeasuredWidth()); //padding for blur

  subStage.addChild(snellen_text);

  // add the diopterTotalLabel

  diopterTotalLabel.x = animationspecs.x + ((animationspecsSize.width - diopterTotalLabel.getBounds().width)/2);
  diopterTotalLabel.y = snellen_chart.y + snellen_chart_size.height;
  subStage.addChild(diopterTotalLabel);

  //add the directionsLabel
  directionsLabel.x = animationspecs.x;
  directionsLabel.y = diopterTotalLabel.y + 40;
  subStage.addChild(directionsLabel);

  //lensesused image

  lensesUsedContainer.x = 0;
  lensesUsedContainer.y = baizeTray.y + baizeTrayDimensions.height;
  lensesUsedContainer.addChild(lensesused_black);
  lensesUsedContainer.addChild(lensesUsedText);
  lensesUsedText.x = (lensesUsedContainer.getBounds().width/2 - (lensesUsedText.getMeasuredWidth()/2)) + 5;
  lensesUsedText.y = (lensesUsedContainer.getBounds().height/2 - (lensesUsedText.getMeasuredHeight()/2)) - 5;
  subStage.addChild(lensesUsedContainer);

  //lensesremaining image

  lensesRemainingContainer.x = 0;
  lensesRemainingContainer.y = lensesUsedContainer.y + (lensesUsedContainer.getBounds().height * 0.8);
  lensesRemainingContainer.addChild(lensesremaining_black);
  lensesRemainingContainer.addChild(lensesremaining);
  lensesremaining.alpha = 0;
  lensesRemainingText.x = (lensesRemainingContainer.getBounds().width/2 - (lensesRemainingText.getMeasuredWidth()/2))+5;
  lensesRemainingText.y = (lensesRemainingContainer.getBounds().height/2 - (lensesRemainingText.getMeasuredHeight()/2)) - 5;
  lensesRemainingContainer.addChild(lensesRemainingText);
  subStage.addChild(lensesRemainingContainer);

  // add the clock

  clockText.x = snellen_chart.x; //padding for blur
  clockText.y = snellen_chart.y + snellen_chart_size.height;
  subStage.addChild(clockText);

  //add the submit buttons
  submitbutton.x = 0; //this will appear after the restart button has been pressed
  submitbutton.y = lensesRemainingContainer.y + (lensesRemainingContainer.getBounds().height * 0.8);
  submitbutton.alpha = 0.0;

  subStage.addChild(submitbutton);

  //add the restart button

  restartbutton.x = 0;
  restartbutton.y = lensesRemainingContainer.y + (lensesRemainingContainer.getBounds().height * 0.8);

  subStage.addChild(restartbutton);
  addEventsToRestartButton();

  //eyeCandyText

  eyeCandyText.y = 0
  //eyeCandyText.x = snellen_chart.x + snellen_chart.getBounds().width;
  allCandyContainers.addChild(eyeCandyText);
  loadTheCandy();
  allCandyContainers.x = snellen_chart.x + snellen_chart_size.width;

  stage.addChild(subStage);
}

function addTheCompletedTextContainer(){
  //complete text
  var rect = new createjs.Shape();
  rect.graphics.beginFill("#7DC1BB").drawRect(0, 0, 500, 150);
  rect.alpha = 1;
  rect.shadow = new createjs.Shadow("#000000", 5, 5, 10);
  completedTextContainer.addChild(rect);
  completedText.x = 20;
  completedText.y = 20;
  completedSubText.x = 20;
  completedSubText.y = completedText.y + 50; //+ completedText.getMeasuredHeight();
  completedText.alpha = 1;
  completedSubText.alpha = 1;
  completedTextContainer.addChild(completedText);
  completedTextContainer.addChild(completedSubText);
  completedTextContainer.x = (subStage.getBounds().width - 250)/2;
  completedTextContainer.y = (subStage.getBounds().height - 150)/2;
  completedTextContainer.alpha = 0;

  subStage.addChild(completedTextContainer);
}

function loadTheCandy(){

  candyLoaded('grey');
  candyLoaded('full');

}

function candyLoaded(candyType){

  var levels = Session.get('numberOfLevels');

  if (candyType == 'grey') { //this loads first so initialize
    for (var i = 0; i < levels; i++) {
      candyContainers[i] = new createjs.Container();
      var candyBitmap = new createjs.Bitmap(queue.getResult('eye_candy_grey'));
      candyBitmap.tag = 'empty';
      candyContainers[i].addChild(candyBitmap);
      candyBitmap.name = i;

        //candy text
      var candyText = new createjs.Text("Time in secs","18px Oxygen Mono", "#303030");
      candyText.x = (candyBitmap.getBounds().width - candyText.getMeasuredWidth())/2;
      candyText.y = candyBitmap.getBounds().height - 5;
      candyText.alpha = 0;
      candyText.name = 'candyText';
      candyContainers[i].addChild(candyText);

      candyContainers[i].y = candyContainers[i].y + eyeCandyText.getMeasuredHeight() + 50 + ((candyBitmap.getBounds().height + candyText.getMeasuredHeight()) * i);
      candyContainers[i].name = 'CandyContainerForLevel'+i;
        candyBitmap.alpha = 1;
        candyBitmap.name = 'empty';
        candyBitmap.level = levels;
    }
  }
  if (candyType == 'full') {

      for (var j = 0; j < levels; j++) {


        var data = {
          images: [ queue.getResult("eye_candy_spritesheet") ],
          frames: { width: 100, height: 55 },
          animations: {
            blink: [0, 5, 'open', 0.5],
            open: [5, 0, 'pause', 0.5],
            pause: [0, 0, false, 4]
          }
        };

        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(30);

      var spriteSheet = new createjs.SpriteSheet(data);
      var candyBitmap = new createjs.Sprite(spriteSheet, 'blink');
      candyBitmap.gotoAndPlay('blink');

      //var candyBitmap = new createjs.Bitmap(queue.getResult('eye_candy'));
      candyBitmap.tag = 'full';
      candyContainers[j].addChild(candyBitmap);
      allCandyContainers.addChild(candyContainers[j]);

      candyContainers[j].name = 'CandyContainerForLevel'+j;
        candyBitmap.alpha = 0;
        candyBitmap.name = 'full';
        candyBitmap.level = levels;

      subStage.addChild(allCandyContainers);

    }
  }
}

function addTheLenses(){
  //add the lenses

  handleLensImageLoad("minus");
  handleLensImageLoad("plus");

}

function addEventsToRestartButton(){
  // add the restart button
  restartbutton.name = 'restartbutton';
      //set hit area for restartbutton
      var hit = new createjs.Shape();
       hit.graphics.beginFill("#000").drawRect(0, 0, restartbutton.getBounds().width, restartbutton.getBounds().height);
    restartbutton.hitArea = hit;

   createjs.Ticker.addEventListener("tick", tick);

  // restartbutton_black.regX = restartbutton_black.getBounds().width / 2 | 0;
   //restartbutton_black.regY = restartbutton_black.getBounds().height / 2 | 0;
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
}

function addEventsToSubmitButton(){
  submitbutton.name = 'submitbutton';
      //set hit area for submitbutton
      var hit = new createjs.Shape();
       hit.graphics.beginFill("#000").drawRect(0, 0, submitbutton.getBounds().width, submitbutton.getBounds().height);
    submitbutton.hitArea = hit;

   createjs.Ticker.addEventListener("tick", tick);

  // restartbutton_black.regX = restartbutton_black.getBounds().width / 2 | 0;
   //restartbutton_black.regY = restartbutton_black.getBounds().height / 2 | 0;
   submitbutton.scaleX = submitbutton.scaleY = submitbutton.scale = 1;
   submitbutton.cursor = "pointer";

   submitbutton.on("rollover", function (evt) {
       this.scaleX = this.scaleY = this.scale * 1.2;
       update = true;
   });

   submitbutton.on("rollout", function (evt) {
       this.scaleX = this.scaleY = this.scale;
       update = true;
   });
   submitbutton.on("click", function(evt){
     //submit fuction to implement
     clickedSubmit()
   });
}

function updateClock(tick){
  if (started) {
    var now = new Date().getTime();
    var newTime = ((now - startTime)/1000).toFixed(2);
    var newTimeString = newTime.toString();
    clockText.text =  newTimeString + " seconds";
  }
}

function createLensesLeft(){
  //now largely defunct
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
    }

    lensesLeftContainer.addChild(lensLeftContainer);
    var baizeTrayDimensions = baizeTray.getBounds();
    lensesLeftContainer.x = baizeTray.x;
    lensesLeftContainer.y = baizeTray.y + baizeTrayDimensions.height;
    subStage.addChild(lensesLeftContainer); //NEW

    //label for when no lenses left in lensesLeftContainer
    noLenses = new createjs.Text("Remove a Lens!", "18px Bungee Shade", "red");
    noLenses.alpha = 0;
    noLensesLength = 200;
    lensesLeftContainerSize = lensesLeftContainer.getBounds();
    noLenses.x = lensesLeftContainer.x;
    noLenses.y = lensesLeftContainer.y;
    subStage.addChild(noLenses); //NEW
  }
}

function handleLensImageLoad(lensType){
    var startOfArray = 0;
    var isPlusLens = false;

    if (lensType == 'minus') {

    }

    if (lensType == "plus") {
        isPlusLens = true;
        startOfArray = 5; //relates to diopter array to label the positive lenses with positive diopter values
    }

  for (var k=0; k<5; k++){ //the number of each lens
      for (var i = startOfArray; i < startOfArray+5; i++) {
        var bitmap;
        if (lensType == 'minus') {
          bitmap = new createjs.Bitmap(queue.getResult('minusLens'));
        } else if(lensType == 'plus'){
          bitmap = new createjs.Bitmap(queue.getResult('plusLens'));
        }
              lensContainer = new createjs.Container();
              allLensesContainer.addChild(lensContainer);
              lensContainer.addChild(bitmap);

              myText=diopters[i]; //retrieve the lens strengths

              var nextLabelText = new createjs.Text(myText,"12px Courier","#FFFFFF");
              nextLabelText.rotation = 40;

                  var lensWidth = bitmap.getBounds().width;
                  var lensHeight = bitmap.getBounds().height;

                   //add text labels to the lenses

                  if (!isPlusLens) {

                      nextLabelText.x = 25;
                      nextLabelText.y = 15;
                      lensContainer.hitArea = minusLensHitArea;

                  }
                  else{
                      lensContainer.hitArea = plusLensHitArea;
                      nextLabelText.rotation = 140;
                      nextLabelText.x = 55;
                      nextLabelText.y = 85;
                  }

              lensContainer.addChild(nextLabelText);
              lensContainer.mouseChildren=false;

              //rotate then place the lens container
              var baizeTrayDimensions = baizeTray.getBounds();

              lensContainer.x = baizeTray.x + (lensWidth * (i + 1)/1.3) + 40;
              lensContainer.y = baizeTray.y + 125;

              if (isPlusLens) {
                  lensContainer.x = baizeTray.x + lensWidth * (i-4)/1.3 + 40;
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
              lensContainer.thisLensHasBeenPlacedAlready = false;

              lensContainer.on("mousedown", function (evt) {

                  this.parent.addChild(this);
                  this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};

              });

              lensContainer.on("pressmove", function (evt) {

                evt.currentTarget.set({
                  x: evt.stageX,
                  y: evt.stageY
                });

                this.x = evt.currentTarget.x;
                this.y = evt.currentTarget.y;

                  //the frame dims when lens is over it

                  var pt = animationspecs.globalToLocal(evt.stageX, evt.stageY);

                  if (animationspecs.hitTest(pt.x, pt.y)) {
                      animationspecs.alpha = 0.2;
                      lensInPlace = true;
                  } else {
                    animationspecs.alpha = 1.0;
                    lensInPlace = false;
                  }

                  // indicate that the stage should be updated on the next tick:
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
                          fadeLabel(true, directionsLabel);
                          fadeLabel(false, clockText);
                          addEventsToSubmitButton();
                          restartbutton.removeAllEventListeners();
                          fadeRestart(false); //fade out the restart button - replace with submit

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

                      lensInPlace = false; //reset the global lensInPlace flag
                      animationspecs.alpha = 1.0;
                      update = true;
                      //reset flag
                      evt.target.lensInPlace = true; //this lens has now been placed

                      //update the lens totals only if this lens has been placed and is yet to be returned to the stack
                      if (!evt.target.thisLensHasBeenPlacedAlready) {
                        var lensValue = parseFloat(evt.target.diopter);
                        //update the scores
                        myTotalDiopters = updateTheLensTotals(lensValue, myTotalDiopters, true)
                        updateTheScores(myTotalDiopters);

                      }

                      //animate the lens into final position
                      nudgeLensIntoPlace(evt);

                      //set the flag
                      evt.target.thisLensHasBeenPlacedAlready = true;



                  } else {
                    //lens is not in place

                    //animate the lens back
                    returnLensToOrigin(evt);

                    if (evt.target.lensInPlace == true ) {
                      // this lens has been removed from the frame
                      evt.target.lensInPlace = false; //this lens is no longer in place
                      // add the lensesLeftContainer lens back

                      numberOfLensesLeft = parseInt(numberOfLensesLeft) + 1;
                      Session.set('numberOfLensesLeft', numberOfLensesLeft);

                        var lensValue = parseFloat(evt.target.diopter);
                        myTotalDiopters = updateTheLensTotals(lensValue, myTotalDiopters, false)
                        updateTheScores(myTotalDiopters);
                        //reset the flag
                        evt.target.thisLensHasBeenPlacedAlready = false;
                    }
                  }
                  updateLensesUsed();
                  updateLensesRemaining();
              });
      }
  }
  subStage.addChild(allLensesContainer);
  addTheCompletedTextContainer();
}

function nudgeLensIntoPlace(event){

    var dioptersOfThisLens = event.target.diopter;
    //lens must rotate and final position moves depending on if positive or negative
    var finalPositionX = hitArea.x+95;
    var finalPositionY = hitArea.y+100;
    var lensRotation = 0;
    var numberOfNegativeLenses = Session.get('negativeLensNumber');
    var numberOfPositiveLenses = Session.get('positiveLensNumber');
    var numberOfLensesLeft = Session.get('numberOfLensesLeft');

    if (!event.target.thisLensHasBeenPlacedAlready) {
      numberOfLensesLeft = numberOfLensesLeft - 1;
      Session.set('numberOfLensesLeft', numberOfLensesLeft);
      lensesInPlace.push(event);

      if (event.target.diopter>0) {

          numberOfPositiveLenses = numberOfPositiveLenses + 1;
          Session.set('positiveLensNumber', numberOfPositiveLenses);
          lensRotation = numberOfPositiveLenses * 20;

          var finalPositionX = hitArea.x+95;
          var finalPositionY = hitArea.y+100;
      } else {
        numberOfNegativeLenses = numberOfNegativeLenses + 1;
        Session.set('negativeLensNumber', numberOfNegativeLenses);
        lensRotation = numberOfNegativeLenses * -20;
      }
      updateLensesUsed();
      updateLensesRemaining();
    } else {
      // this lens has previously been placed and not yet returned to stack
      if (event.target.diopter>0) {
        lensRotation = numberOfPositiveLenses * 20;
      } else {
        lensRotation = numberOfNegativeLenses * -20;
      }
    }

    createjs.Tween.get(event.target).to({x:finalPositionX, y:finalPositionY},500,createjs.Ease.linear).to({rotation: lensRotation }, 1000, createjs.Ease.linear).call(nudgeComplete);
    update = true;


}

function nudgeComplete(event){
  event.target.mouseEnabled=true;
}

function returnLensToOrigin(event){

  var lensToReturn = event.target;

  var numberOfNegativeLenses = Session.get('negativeLensNumber');
  var numberOfPositiveLenses = Session.get('positiveLensNumber');

    //only update numbers of lenses if this lens has been placed and not yet returned to stack

    if (event.target.lensInPlace ) {

      var index = lensesInPlace.indexOf(event);
      lensesInPlace.splice(index, 1);

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

    }

    //lens must rotate depending on if positive or negative
    var lensRotation = 0;

    createjs.Tween.get(event.target).to({ guide:{path:[event.target.x, event.target.y, event.target.x+200, event.target.y+200, event.target.originalX, event.target.originalY] }},500).to({rotation: lensRotation }, 1000, createjs.Ease.linear).call(returnComplete);
    update = true;

    createjs.Ticker.addEventListener("tick", stage);
    event.target.mouseEnabled = true;
}

function returnComplete(){
  //
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

    if (blurTick) {
      if (lensContainer.isVisible()) {
        blurTick = false;
      }
      stage.update();
    }

    if (candyTick) {
      candyTick.update();
      stage.update();
    }

}

function handleComplete(evt){
    stage.update();
}

function selectPatient(){
  var longrefraction = 0;
  do {
    longrefraction = Math.random()*(8+8+1)-8;
  } while (longrefraction == 0);
    var inquarters =  Math.round(longrefraction * 4) / 4;
    return inquarters.toFixed(2);
}

function fadeLabel(fade, label){

  if (fade) {
    fadeFlag = true;
  //  createjs.Ticker.addEventListener("tick", tick);
    createjs.Tween.get(label, {loop: false}).to({alpha: 0}, 500, createjs.Ease.getPowInOut(2));

  } else {
    createjs.Tween.get(label, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2));
    fadeFlag = true;
  //  createjs.Ticker.addEventListener("tick", tick);
  }
}

function fadeRestart(fadein){
  if(fadein){
    fadeFlag = true;
    //now fade out the submit button
    createjs.Tween.get(submitbutton, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2)).call(fadeOutSubmitComplete);
  } else {
    fadeFlag = true;
    createjs.Tween.get(restartbutton, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2)).call(fadeOutRestartComplete);
  }
}

function fadeOutRestartComplete(){
  restartbutton.visible = false;
  submitbutton.visible = true;
  createjs.Tween.get(submitbutton, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2));
}

function fadeOutSubmitComplete(){
  //fade in the restart button
  submitbutton.visible = false;
  restartbutton.visible = true;
  createjs.Tween.get(restartbutton, {loop: false}).to({alpha: 1}, 500, createjs.Ease.getPowInOut(2));
}

function updateLensesUsed(){
  var lensesUsedNumber = (5 - Session.get('numberOfLensesLeft'));
  lensesUsedText.text =  lensesUsedNumber;
}

function updateLensesRemaining(){
  var lensesRemaining = Session.get('numberOfLensesLeft');
  lensesRemainingText.text = lensesRemaining;
  if (lensesRemaining == 0) {
    lensesremaining.alpha = 1;
  } else {
    lensesremaining.alpha = 0;
  }
}

function updateTheLensTotals(lensValue, runningTotal, Add){
    var totalLensValue = 0;

    if (Add==true) {
            totalLensValue = lensValue + runningTotal;
    }
    else{
            totalLensValue = runningTotal - lensValue;
    }

    diopterTotalText = totalLensValue + " DS total"

    if (totalLensValue % 1 === 0) {
      diopterTotalText = totalLensValue + ".00 DS total"
    }
    if (totalLensValue % 1 === -0.5) {
      diopterTotalText = parseInt(totalLensValue) + ".50 DS total"
      if (totalLensValue === -0.5) {
        diopterTotalText = "-"+parseInt(totalLensValue) + ".50 DS total"
      }
    }
    if (totalLensValue % 1 === 0.5) {
      diopterTotalText = parseInt(totalLensValue) + ".50 DS total"
    }
    if (totalLensValue > 0) {
      diopterTotalText = "+"+diopterTotalText;
    }

    diopterTotalLabel.text = diopterTotalText;
    diopterTotalLabel.x = animationspecs.x + ((animationspecs.getBounds().width - diopterTotalLabel.getBounds().width)/2);

    return totalLensValue;
}

function updateTheScores(lensesTotals){

    var patient = Session.get('myPatient');
    netDiopters = parseFloat(patient) + parseFloat(lensesTotals); //this is the degree of blur unless overplussed
    var snellenString = snellenFromDiopters(netDiopters); //this is the snellen value if not overplussed/minussed

    blurSnellenChart(netDiopters);
    snellen_text.text = snellenString;
    fadeLabel(false, snellen_text);

    //console.log('patient error: '+ netDiopters); //comment out in production

}

function loseALevel(){
  var level = Session.get('currentLevel');
  var candyToAlpha = candyContainers[level-2].getChildByName('full');
  candyToAlpha.alpha = 0;
  var candyTextToAlpha = candyContainers[level-2].getChildByName('candyText');
  fadeLabel(true, candyTextToAlpha);
  level --;
  Session.set('currentLevel', level);
  console.log(level);
}

function moveUpALevel(){
  var level = Session.get('currentLevel');
  var totalLevels = Session.get('numberOfLevels');

    //add a candy for current level
    var candyToAlpha = candyContainers[level-1].getChildByName('full');
    candyToAlpha.alpha = 1;
    var time = clockText.text;
    var candyTextToAlpha = candyContainers[level-1].getChildByName('candyText');
    candyTextToAlpha.text = time;

  //gain a level
  if (level < 3) {
    //show the success text box
    fadeLabel(false, candyTextToAlpha);
    completedSubText.text = level + ' down. ' + (totalLevels - level) + ' more to go.\nPress restart to have another go.';
    completedSubText.lineHeight = 40;
    fadeLabel(false, completedTextContainer);

    level ++ ;
    Session.set('currentLevel', level);
  } else {
    //level 3 is complete, now go up a stage and start again
    Session.set('currentLevel', 1);
    var achievementStage = Session.get('currentStage');
    achievementStage ++;
    Session.set('currentStage', achievementStage);
    // need some way of celebrating level up and reporting back
    if (achievementStage > 1) {
      var levelErrorForIndex = Session.get('levelErrorForIndex');
      levelErrorForIndex = 2;
      Session.set('levelErrorForIndex', levelErrorForIndex);
    }
    //remove the eyeCandy
    for (var i = 0; i < candyContainers.length; i++) {
      var candyImage = candyContainers[i].getChildByName('full');
      candyImage.alpha = 0;
      var candyText = candyContainers[i].getChildByName('candyText');
      fadeLabel(true, candyText);
    }

  }

}

function snellenFromDiopters(diopterValue){

  /*
    var s = Math.pow(10, ((diopterValue / 2) + 1.25));
    var sm = s * 0.3048; //convert feet to metres
    return Math.round(sm);
    */
    var indexAlteration = Session.get('levelErrorForIndex');
    var indexOfRefractiveError = 0;
    var patient = Session.get("myPatient");
    var planoIsNormal = true;
    if (patient > 0 && indexAlteration > 0 || patient < 0 && indexAlteration > 0) {
      // plano <> 6/6
      planoIsNormal = false;
    }

  var snellenArray = [];

  var random3 = Math.random()*(3-1)+1;

  if (diopterValue > 0 || (diopterValue == 0 && patient > 0 && indexAlteration > 0)) {
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

    return snellenArray[indexOfRefractiveError + indexAlteration];
  }
  if (diopterValue < 0 || (diopterValue == 0 && patient < 0 && indexAlteration > 0)) {

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
    return snellenArray[indexOfRefractiveError + indexAlteration];
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
  blurTick = true;

  stage.update();

}

function restart(){

    Session.set('negativeLensNumber', 0);
    Session.set('numberOfLensesLeft', 5);
    Session.set('positiveLensNumber', 0);
    updateLensesUsed();
    updateLensesRemaining();

  for (var i = 0; i < lensesInPlace.length; i++) {
    var lensEvent = lensesInPlace[i];
    var lens = lensEvent.target;
    lens.thisLensHasBeenPlacedAlready = false;
    lens.lensInPlace = false;
    returnLensToOrigin(lensesInPlace[i]);
  }

  resetVariables();

  //re-enable lenses
  allLensesContainer.mouseEnabled = true;

  var myPatient = selectPatient();
  Session.set('myPatient', myPatient);
  updateTheScores(0);
  updateTheLensTotals(0, 0, true);
  clockText.text = '0.00 seconds';
  fadeLabel(true, clockText);
  fadeLabel(true, completedTextContainer);
  fadeLabel(false, directionsLabel);

  submitbutton.removeAllEventListeners();
  addEventsToRestartButton();
  fadeRestart(false);
  stage.update();

}

function showTheDialog(finalscore){

    bootbox.dialog({
        message:  "Your average time to refract over " + Session.get("attempts") + " attempts was "+ finalscore.toFixed(2).toString()+ ' seconds. Save your score (if you want to), and then click restart to begin the next level!',
        title: "Well done " + Meteor.user().profile.name + '!',
        buttons:{
            success: {
                label: "Save Score",
                className: "btn-success",
                callback: function(){
                  saveTheTime(finalscore);
                  restart(true);
                }
            },
            main:{
            label: "Naw. Forget it.",
            className: "btn-primary",
            called: function(){
                  console.log('forgotten');
                  restart(false);
                }
            }
        }

    });

  //  stage.mouseChildren = false;

  //  stage.removeAllEventListeners();

}

function clickedSubmit(){
  //stop the clock
  started = false;

  //disable the stage
  allLensesContainer.mouseEnabled = false;

  var attempts = Session.get('attempts');
  attempts ++;
  Session.set('attempts', attempts);

  //get the patient refractive error and the student prescription
  var patient = Session.get('myPatient');
  netDiopters = parseFloat(patient) + parseFloat(myTotalDiopters);

  var level = Session.get('currentLevel');
  var levels = Session.get('numberOfLevels');

  if(netDiopters==0.0){
    // student has the correct prescription!
    // save the time
    var times = Session.get('timesArray');
    var time = parseFloat(clockText.text);
    times.push(time);
    Session.set('timesArray', times);

    if (level <= levels) {
      moveUpALevel();
    }

    if (level == levels) {
      showTheDialog(averageTime());
    }

    addEventsToRestartButton();
    submitbutton.removeAllEventListeners();
    fadeRestart(true);
  } else {
    //student has the wrong prescription
    failedDialog(patient);
    if(level > 1){
      console.log("I am losing a level");
      loseALevel();
    }
  }

}

function failedDialog(patient_refractive_error){
  var actualPrescription = "";
  var candidate_prescription = "";
  if(myTotalDiopters > 0){ //candidate prescription is positive
    candidate_prescription = "+"+ myTotalDiopters.toFixed(2);
  }else { //candidate prescription is negative
    candidate_prescription = myTotalDiopters.toFixed(2);
  }
  if(patient_refractive_error > 0){ //patient actual prescription is negative
    actualPrescription = parseFloat(patient_refractive_error *= -1).toFixed(2);
  } else { //patient actual prescription is positive
    actualPrescription = "+"+ parseFloat(patient_refractive_error *= -1).toFixed(2);
  }
  bootbox.alert({
      size: "small",
      message:  "Your chosen prescription of "+ candidate_prescription + " DS did not match the patient\'s actual prescription of " + actualPrescription + " DS! Try again (your time won't be recorded, but you do lose an eye candy)",
      title: "Ouch! Nice try, " + Meteor.user().profile.name + '!',
      /*
      buttons:{
          success: {
              label: "Thanks anyway",
              className: "btn-success",
              callback: function(){
                restart()
              }
          }
      }
      */
      callback: function(){
        restart()
      },
      onEscape: function(){
        restart()
      },
      closeButton: false
  });
}

function saveTheTime(finalScore){
  Meteor.call('addNewScore', finalScore, function(error, result){
    if (result) {
      Meteor.call('updateTopScore', result, function(error, newresults){
        console.log(newresults);
      });
    } else {
      console.log('there was no result');
    }

    if (error) {
      console.log(error);
    }
  });

}

function averageTime(){
  var times = Session.get('timesArray');
  var totalTime = 0;
  for (var i = 0; i < times.length; i++) {
    totalTime += times[i];
  }
  var numberOfTimes = times.length;
  //reset the times
  times = [];
  Session.set('timesArray', times);

  return totalTime/numberOfTimes;
}
