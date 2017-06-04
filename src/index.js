/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

//const APP_ID = '';  // TODO replace with your app ID (OPTIONAL).';

// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const RadioChannel = {
  'mnm'   : {
    'code': 55,
    'speech': 'M and M',
    'values': ['mnm', 'm and m'],
  },
  'stubru': {
    'code': 41,
    'speech': 'Studio Brussels',
    'values': ['stubru', 'studio brussels'],
  },
  'klara' : {
    'code': 31,
    'speech': 'Klara',
    'values': ['klara'],
  },
  'radio2': {
    'code': 21,
    'speech': 'Radio Two',
    'values': ['radio2', 'radio two'],
  },
  'radio1': {
    'code': 11,
    'speech': 'Radio One',
    'values': ['radio1', 'radio one'],
  },
};

const vrtServicePlaylistOnair = {
  host: 'services.vrt.be',
  path: '/playlist/onair',
  //port: '80',
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.playlist.vrt.be.noa_1.0+json',
  }
};

const languageStrings = {
  'en': {
    translation: {
      FACTS: [
        'A year on Mercury is just 88 days long.',
        'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
        'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
        'On Mars, the Sun appears about half the size as it does on Earth.',
        'Earth is the only planet not named after a god.',
        'Jupiter has the shortest day of all the planets.',
        'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
        'The Sun contains 99.86% of the mass in the Solar System.',
        'The Sun is an almost perfect sphere.',
        'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
        'Saturn radiates two and a half times more energy into space than it receives from the sun.',
        'The temperature inside the Sun can reach 15 million degrees Celsius.',
        'The Moon is moving approximately 3.8 cm away from our planet every year.',
      ],
      SKILL_NAME: 'Space Facts',
      GET_FACT_MESSAGE: "Here's your fact: ",
      HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
      HELP_REPROMPT: 'What can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
    },
  },
  'en-US': {
    translation: {
      FACTS: [
        'A year on Mercury is just 88 days long.',
        'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
        'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
        'On Mars, the Sun appears about half the size as it does on Earth.',
        'Earth is the only planet not named after a god.',
        'Jupiter has the shortest day of all the planets.',
        'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
        'The Sun contains 99.86% of the mass in the Solar System.',
        'The Sun is an almost perfect sphere.',
        'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
        'Saturn radiates two and a half times more energy into space than it receives from the sun.',
        'The temperature inside the Sun can reach 15 million degrees Celsius.',
        'The Moon is moving approximately 3.8 cm away from our planet every year.',
      ],
      SKILL_NAME: 'American Space Facts',
    },
  },
  'en-GB': {
    translation: {
      FACTS: [
        'A year on Mercury is just 88 days long.',
        'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
        'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
        'On Mars, the Sun appears about half the size as it does on Earth.',
        'Earth is the only planet not named after a god.',
        'Jupiter has the shortest day of all the planets.',
        'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
        'The Sun contains 99.86% of the mass in the Solar System.',
        'The Sun is an almost perfect sphere.',
        'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
        'Saturn radiates two and a half times more energy into space than it receives from the sun.',
        'The temperature inside the Sun can reach 15 million degrees Celsius.',
        'The Moon is moving approximately 3.8 cm away from our planet every year.',
      ],
      SKILL_NAME: 'British Space Facts',
    },
  },
  'de': {
    translation: {
      FACTS: [
        'Ein Jahr dauert auf dem Merkur nur 88 Tage.',
        'Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.',
        'Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.',
        'Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.',
        'Die Erde ist der einzige Planet, der nicht nach einem Gott benannt ist.',
        'Jupiter hat den kürzesten Tag aller Planeten.',
        'Die Milchstraßengalaxis wird in etwa 5 Milliarden Jahren mit der Andromeda-Galaxis zusammenstoßen.',
        'Die Sonne macht rund 99,86 % der Masse im Sonnensystem aus.',
        'Die Sonne ist eine fast perfekte Kugel.',
        'Eine Sonnenfinsternis kann alle ein bis zwei Jahre eintreten. Sie ist daher ein seltenes Ereignis.',
        'Der Saturn strahlt zweieinhalb mal mehr Energie in den Weltraum aus als er von der Sonne erhält.',
        'Die Temperatur in der Sonne kann 15 Millionen Grad Celsius erreichen.',
        'Der Mond entfernt sich von unserem Planeten etwa 3,8 cm pro Jahr.',
      ],
      SKILL_NAME: 'Weltraumwissen auf Deutsch',
      GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
      HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
      HELP_REPROMPT: 'Wie kann ich dir helfen?',
      STOP_MESSAGE: 'Auf Wiedersehen!',
    },
  },
};

// 2. Skill Code =======================================================================================================

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('GetFact');
  },
  'GetNewFactIntent': function () {
    this.emit('GetFact');
  },
  'GetLatestSongMnmIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': RadioChannel.mnm,
      'onairType': 'latest' // now, previous, latest.
    };

    httpsGetPlaylistOnair(myRequest, handlePlaylistOnair, _this);
  },
  'GetLatestSongStubruIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': RadioChannel.stubru,
      'onairType': 'latest' // now, previous, latest.
    };

    httpsGetPlaylistOnair(myRequest, handlePlaylistOnair, _this);
  },
  'GetLatestSongKlaraIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': RadioChannel.klara,
      'onairType': 'latest' // now, previous, latest.
    };

    httpsGetPlaylistOnair(myRequest, handlePlaylistOnair, _this);
  },
  'GetLatestSongRadioOneIntent': function () {
    var _this     = this;
    var myRequest = {
      'channel': RadioChannel.radio1,
      'onairType': 'latest' // now, previous, latest.
    };

    httpsGetPlaylistOnair(myRequest, handlePlaylistOnair, _this);
  },
  'GetLatestSongRadioTwoIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': RadioChannel.radio2,
      'onairType': 'latest' // now, previous, latest.
    };

    httpsGetPlaylistOnair(myRequest, handlePlaylistOnair, _this);
  },
  'GetFact': function () {
    // Get a random space fact from the space facts list
    // Use this.t() to get corresponding language data
    const factArr = this.t('FACTS');
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];

    // Create speech output
    const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
    this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
};

// 3. Helpers ==========================================================================================================
// 3.1. Helper variables ===============================================================================================

var https = require('https');

// 3.2. Helper Callback functions ======================================================================================

var handlePlaylistOnair = function(onairData, myRequest, handlerObject) {
  var onairSong = getOnairSong(onairData, myRequest.onairType);
  var myResult = {
    'req': myRequest,
    'res': {
      'song': onairSong,
    }
  };

  saySong(myResult, handlerObject);
};

// 3.3. Helper functions ================================================================================================

function httpsGetPlaylistOnair(myRequest, callback, handlerObject) {
  var onairData = "";

  // Add filter to request.
  vrtServicePlaylistOnair.path = vrtServicePlaylistOnair.path + '?channel_code=' + myRequest.channel.code;

  // Handle HTTPS request.
  var req = https.request(vrtServicePlaylistOnair, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(dataChunk) {
      onairData += dataChunk;
    });
    res.on('end', function() {
      callback(onairData, myRequest, handlerObject);
    });
  });
  req.end();
};

function getOnairSong(onairData, requestedOnairType) {
  var onairDataJson = JSON.parse(onairData);
  var onairSong = {};

  if (requestedOnairType.toLowerCase() == 'now') {
    onairSong = getSong(onairDataJson, 'NOW');
  }
  else if (requestedOnairType.toLowerCase() == 'previous') {
    onairSong = getSong(onairDataJson, 'PREVIOUS');
  }
  else if (requestedOnairType.toLowerCase() == 'latest') {
    onairSong = getSong(onairDataJson, 'NOW');
    if (Object.keys(onairSong).length === 0 && onairSong.constructor === Object) {
      onairSong = getSong(onairDataJson, 'PREVIOUS');
    }
  }
  else {
    //@todo throw error / trigger something.
  }

  return onairSong;
}

function getSong(onairDataJson, onairType) {
  var onairSong = {};
  onairDataJson.onairs.forEach(function(element){
    if(element.onairType == onairType) {
      onairSong = element;
    }
  });

  return onairSong;
}

function saySong(myResult, handlerObject) {
  // Init vars.
  var speechOutput = '';
  var speechVars = sanitizeVarsSaySong(myResult);

  // Prepare speechOutput
  speechOutput += 'On ' + speechVars.reqChannel + '. ';
  speechOutput += 'The ' + speechVars.reqOnairType + ' song is ' + speechVars.title + '. ';
  speechOutput += 'The artist is ' + speechVars.artist + '. ';
  speechOutput += 'The composer is ' +  speechVars.composer + '.';

  console.log('\n--- SaySong START ---');
  console.log("Request data\n\t" + JSON.stringify(myResult.req));
  console.log("\nResponse data\n\t" + JSON.stringify(myResult.res));
  console.log("\nSpeechOutput\n\t" + speechOutput);
  console.log('--- SaySong END ---');

  // Tell Alexa what to emit.
  handlerObject.emit(':tellWithCard', speechOutput, 'Playlist onair of MNM', speechOutput);
}

function sanitizeVarsSaySong(myResult) {
  var song = myResult.res.song;
  var speechVars = {
    'title': 'Not available',
    'artist': 'Not available',
    'composer': 'Not available',
    'reqChannel': myResult.req.channel.speech,
    'reqOnairType': myResult.req.onairType,
  };

  // Prepare speechVars.
  if(Object.keys(song).length != 0 && song.constructor === Object){
    song.properties.forEach(function(property){
      if(property.key == 'TITLE'){
        speechVars.title = property.value;
      }
      if(property.key == 'ARTISTNAME'){
        speechVars.artist = property.value;
      }
      if(property.key == 'COMPOSER'){
        speechVars.composer = property.value;
      }
    });
  }

  return speechVars;
}