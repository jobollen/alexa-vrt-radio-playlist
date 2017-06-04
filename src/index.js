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

const APP_ID = '';  // TODO replace with your app ID (OPTIONAL).';

// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const vrtRadioChannels = {
  'mnm'   : {
    'code': 55,
    'speech': 'M and M',
    'value': ['mnm', 'm and m'],
  },
  'stubru': {
    'code': 41,
    'speech': 'Studio Brussels',
    'value': ['stubru', 'studio brussels'],
  },
  'klara' : {
    'code': 31,
    'speech': 'Klara',
    'value': ['klara'],
  },
  'radio2': {
    'code': 21,
    'speech': 'Radio Two',
    'value': ['radio2', 'radio two'],
  },
  'radio1': {
    'code': 11,
    'speech': 'Radio One',
    'value': ['radio1', 'radio one'],
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
      'channel': vrtRadioChannels.mnm,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsVrtGetPlaylistOnair(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongStubruIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': vrtRadioChannels.stubru,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsVrtGetPlaylistOnair(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongKlaraIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': vrtRadioChannels.klara,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsVrtGetPlaylistOnair(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongRadioOneIntent': function () {
    var _this     = this;
    var myRequest = {
      'channel': vrtRadioChannels.radio1,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsVrtGetPlaylistOnair(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongRadioTwoIntent': function () {
    var _this = this;
    var myRequest = {
      'channel': vrtRadioChannels.radio2,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsVrtGetPlaylistOnair(myRequest, handleVrtPlaylistOnair, _this);
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

var handleVrtPlaylistOnair = function(onairData, myRequest, handlerObject) {
  var onairSong = getVrtOnairSong(onairData, myRequest.onairType);
  var speechVars = getSpeechVarsVrtOnairSong(myRequest, onairSong);
  var myResult = {
    'req': myRequest,
    'res': {
      'song': onairSong,
      'speechVars': speechVars,
    }
  };
  var speechOutput = getSpeechOutput(myResult);

  // Logging.
  console.log('\n--- handleVrtPlaylistOnair START ---');
  console.log('1. The onairData from the PlaylistOnair Service (stringified)\n\n\t' + JSON.stringify(JSON.parse(onairData)));
  console.log('\n2. The request of the resultData (Stringified)\n\n\t' + JSON.stringify(myResult.req));
  console.log('\n3. The response of the resultData (Stringified)\n\n\t' + JSON.stringify(myResult.res));
  console.log('\n4. SpeechOutput: ' + speechOutput);
  console.log('--- handleVrtPlaylistOnair END ---\n');

  // Tell Alexa what to emit.
  handlerObject.emit(':tellWithCard', speechOutput, 'VRT Playlist onair of ' + myRequest.channel.value[0], speechOutput);
};

// 3.3. Helper functions ================================================================================================

function httpsVrtGetPlaylistOnair(myRequest, callback, handlerObject) {
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

function getVrtOnairSong(onairData, requestedOnairType) {
  var onairDataJson = JSON.parse(onairData);
  var onairSong = {};

  if (requestedOnairType.toLowerCase() == 'current') {
    onairSong = getVrtOnairSongByType(onairDataJson, 'NOW');
  }
  else if (requestedOnairType.toLowerCase() == 'previous') {
    onairSong = getVrtOnairSongByType(onairDataJson, 'PREVIOUS');
  }
  else if (requestedOnairType.toLowerCase() == 'latest') {
    onairSong = getVrtOnairSongByType(onairDataJson, 'NOW');
    if (Object.keys(onairSong).length === 0 && onairSong.constructor === Object) {
      onairSong = getVrtOnairSongByType(onairDataJson, 'PREVIOUS');
    }
  }
  else {
    //@todo throw error / trigger something.
  }

  return onairSong;
}

function getVrtOnairSongByType(onairDataJson, onairType) {
  var onairSong = {};
  onairDataJson.onairs.forEach(function(element){
    if(element.onairType == onairType) {
      onairSong = element;
    }
  });

  return onairSong;
}

function getSpeechVarsVrtOnairSong(myRequest, onairSong) {
  var speechVars = {
    'title': 'Not available',
    'artist': 'Not available',
    'composer': 'Not available',
    'reqChannel': myRequest.channel.speech,
    'reqOnairType': myRequest.onairType,
  };

  // Prepare speechVars.
  if(Object.keys(onairSong).length != 0 && onairSong.constructor === Object){
    onairSong.properties.forEach(function(property){
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

function getSpeechOutput(myResult) {
  // Init vars.
  var speechOutput = '';
  var speechVars = myResult.res.speechVars;

  // Prepare speechOutput
  speechOutput += 'On ' + speechVars.reqChannel + '. ';
  if (myResult.req.filter == 'song' || myResult.req.filter == 'all') {
    speechOutput += 'The ' + speechVars.reqOnairType + ' song is ' + speechVars.title + '. ';
  }
  if (myResult.req.filter == 'artist' || myResult.req.filter == 'all') {
    speechOutput += 'The artist of the ' + speechVars.reqOnairType + ' song is ' + speechVars.artist + '. ';
  }
  if (myResult.req.filter == 'composer' || myResult.req.filter == 'all') {
    speechOutput += 'The composer of the ' + speechVars.reqOnairType + ' song is ' + speechVars.composer + '.';
  }

  return speechOutput;
}