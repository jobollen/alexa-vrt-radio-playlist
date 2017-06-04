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

const vrtRadioChannel = {
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

const vrtService = {
  playlistOnair: {
    host: 'services.vrt.be',
    path: '/playlist/onair',
    //port: '80',
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.playlist.vrt.be.noa_1.0+json',
    }
  }
};

const languageStrings = {
  'en': {
    translation: {
      HELP_MESSAGE: 'You can say "tell me the latest song on studio brussels", or, you can say exit... What can I help you with?',
      HELP_REPROMPT: 'What can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
    },
  },
  'en-US': {
    translation: {
    },
  },
  'en-GB': {
    translation: {
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
    this.emit('GetLatestSongStubruIntent');
  },
  'GetLatestSongMnmIntent': function () {
    var _this = this;
    var myRequest = {
      'service': 'playlistOnair',
      'channel': vrtRadioChannel.mnm,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongStubruIntent': function () {
    var _this = this;
    var myRequest = {
      'service': 'playlistOnair',
      'channel': vrtRadioChannel.stubru,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongKlaraIntent': function () {
    var _this = this;
    var myRequest = {
      'service': 'playlistOnair',
      'channel': vrtRadioChannel.klara,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongRadioOneIntent': function () {
    var _this     = this;
    var myRequest = {
      'service': 'playlistOnair',
      'channel': vrtRadioChannel.radio1,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetLatestSongRadioTwoIntent': function () {
    var _this = this;
    var myRequest = {
      'service': 'playlistOnair',
      'channel': vrtRadioChannel.radio2,
      'onairType': 'latest', // current, previous, latest.
      'filter': 'song', // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
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

function httpsGetVrtService(myRequest, callback, handlerObject) {
  var onairData = "";

  var service = null;
  
  if (typeof myRequest.service != 'undefined' && myRequest.service == 'playlistOnair') {
    // Add filter to request.
    vrtService.playlistOnair.path = vrtService.playlistOnair.path + '?channel_code=' + myRequest.channel.code;

    // Set service.
    service = vrtService.playlistOnair;
  }

  if (service != null) {
    // Handle HTTPS request.
    var req = https.request(service, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(dataChunk) {
        onairData += dataChunk;
      });
      res.on('end', function() {
        callback(onairData, myRequest, handlerObject);
      });
    });
    req.end();
  }
  else {
    if (typeof myRequest.service == 'undefined') {
      console.log('ERROR: The VRT service is undefined. See myRequest.service variable in handlers.');
    }
    else {
      console.log('ERROR: The VRT service ' + myRequest.service + ' not exits. See myRequest.service variable in handlers.');
    }
  }
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
    if (myResult.req.filter == 'all') {
      speechOutput += 'The ' + speechVars.reqOnairType + ' song is ' + speechVars.title + ' ';
    }
    else {
      speechOutput += 'The ' + speechVars.reqOnairType + ' song is ' + speechVars.title + ' played by ' + speechVars.artist + '.';
    }
  }
  if (myResult.req.filter == 'artist' || myResult.req.filter == 'all') {
    if (myResult.req.filter == 'all') {
      speechOutput += 'played by ' + speechVars.artist + '. ';
    }
    else {
      speechOutput += 'The artist of the ' + speechVars.reqOnairType + ' song is ' + speechVars.artist + '. ';
    }
  }
  if (myResult.req.filter == 'composer' || myResult.req.filter == 'all') {
    if (myResult.req.filter == 'all') {
      speechOutput += 'And the composer is ' + speechVars.composer + '. ';
    }
    else {
      speechOutput += 'The composer of the ' + speechVars.reqOnairType + ' song is ' + speechVars.composer + '.';
    }
  }

  return speechOutput;
}