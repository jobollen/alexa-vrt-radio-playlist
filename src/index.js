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

var vrtRadioChannel = {
  'mnm'   : {
    'code': 55,
    'speech': {
      output: 'M and M',
      input: ['mnm', 'm and m', 'm.', 'emiem', 'radio 5', 'redio 5', 'ridio 5']
    },
    'label': 'MNM'
  },
  'stubru': {
    'code': 41,
    'speech': {
      output: 'Studio Brussel',
      input: ['stubru', 'studio brussel', 'studio brussels', 'stupid', 'studio brusscls', 'studio brusscl', 'radio 4', 'redio 4', 'ridio 4']
    },
    'label': 'Studio Brussel'
  },
  'klara' : {
    'code': 31,
    'speech': {
      output: 'Klara',
      input: ['klara','radio 3', 'redio 3', 'ridio 3']
    },
    'label': 'Klara'
  },
  'radio2': {
    'code': 21,
    'speech': {
      output: 'Radio Two',
      input: ['radio2', 'radio 2', 'radio one', 'radioone', 'redio2', 'redio 2', 'redio one', 'redioone', 'ridio to', 'redio to']
    },
    'label': 'Radio 2'
  },
  'radio1': {
    'code': 11,
    'speech': {
      output: 'Radio One',
      input: ['radio1', 'radio 1', 'radio one', 'radioone', 'redio1', 'redio 1' , 'ridio 1']
    },
    'label': 'Radio 1'
  }
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
    this.emit('GetKlaraIntent');
  },
  'InputTestChannelIntent': function () {
    var slotChannel = isSlotValid(this.event.request, "channel");
    var speechTest = 'The test starts in 3 seconds <break time="3s"/> <say-as interpret-as="spell-out"><prosody rate="x-slow">'+slotChannel+'</prosody></say-as>,';
    this.emit(':tell', speechTest);
  },
  'InputTestOnairTypeIntent': function () {
    var slotOnairType = isSlotValid(this.event.request, "onairType");
    var speechTest = 'The test starts in 3 seconds <break time="3s"/> say-as interpret-as="spell-out"><prosody rate="x-slow">'+slotOnairType+'</prosody></say-as>,';
    this.emit(':tell', speechTest);
  },
  'GetLatestSongIntent': function () {
    var slotChannel = isSlotValid(this.event.request, "channel");
    const channel = getChannel(slotChannel);
    var _this = this;
    var myRequest = {
      'service': 'playlistOnair',
      'channel': channel,
      'onairType': 'latest', // current, previous, latest.
      'mainType': 'song', // song, artist, composer, all.
    };

    console.log(channel);
    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetMnmIntent': function () {
    var _this = this;
    var serviceName = 'playlistOnair';
    var channel = vrtRadioChannel.mnm;
    var onairType = validateEventRequest(this.event.request, "onairType", channel, _this);
    var mainType = validateEventRequest(this.event.request, "mainType", channel, _this);
    var myRequest = {
      'service': serviceName,
      'channel': channel,
      'onairType': onairType, // current, previous, latest.
      'mainType': mainType, // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetStubruIntent': function () {
    var _this = this;
    var serviceName = 'playlistOnair';
    var channel = vrtRadioChannel.stubru;
    var onairType = validateEventRequest(this.event.request, "onairType", channel, _this);
    var mainType = validateEventRequest(this.event.request, "mainType", channel, _this);
    var myRequest = {
      'service': serviceName,
      'channel': channel,
      'onairType': onairType, // current, previous, latest.
      'mainType': mainType, // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetKlaraIntent': function () {
    var _this = this;
    var serviceName = 'playlistOnair';
    var channel = vrtRadioChannel.klara;
    var onairType = validateEventRequest(this.event.request, "onairType", channel, _this);
    var mainType = validateEventRequest(this.event.request, "mainType", channel, _this);
    var myRequest = {
      'service': serviceName,
      'channel': channel,
      'onairType': onairType, // current, previous, latest.
      'mainType': mainType, // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetRadioOneIntent': function () {
    var _this     = this;
    var serviceName = 'playlistOnair';
    var channel = vrtRadioChannel.stubru;
    var onairType = validateEventRequest(this.event.request, "onairType", channel, _this);
    var mainType = validateEventRequest(this.event.request, "mainType", channel, _this);
    var myRequest = {
      'service': serviceName,
      'channel': channel,
      'onairType': onairType, // current, previous, latest.
      'mainType': mainType, // song, artist, composer, all.
    };

    httpsGetVrtService(myRequest, handleVrtPlaylistOnair, _this);
  },
  'GetRadioTwoIntent': function () {
    var _this = this;
    var serviceName = 'playlistOnair';
    var channel = vrtRadioChannel.radio2;
    var onairType = validateEventRequest(this.event.request, "onairType", channel, _this);
    var mainType = validateEventRequest(this.event.request, "mainType", channel, _this);
    var myRequest = {
      'service': serviceName,
      'channel': channel,
      'onairType': onairType, // current, previous, latest.
      'mainType': mainType, // song, artist, composer, all.
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
  var onairDataJson = JSON.parse(onairData);
  var onairSongData = getVrtOnairSong(onairDataJson, myRequest.onairType);
  var speechVars = getSpeechVarsVrtOnairSong(myRequest, onairSongData);
  var myResult = {
    'req': myRequest,
    'res': {
      'song': onairSongData,
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
  handlerObject.emit(':tellWithCard', speechOutput, 'VRT Playlist onair of ' + myRequest.channel.label, speechOutput);
};

// 3.3. Helper functions ================================================================================================

function validateEventRequest(EventRequest, EventRequestName, channel, handlerObject) {
  var slotOnairType = isSlotValid(EventRequest, EventRequestName);
  if (slotOnairType) {
    return slotOnairType;
  } else {
    var speechTest = 'The ' + EventRequestName + ' was invalid. Please ask, ...';
    handlerObject.emit(':tell', speechTest);
  }
}
function isSlotValid(request, slotName){
  var slot = request.intent.slots[slotName];
  //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
  var slotValue;

  console.log(JSON.stringify(request.intent.slots));
  console.log(slot.value);
  //if we have a slot, get the text and store it into speechOutput
  if (slot && slot.value) {
    //we have a value in the slot
    slotValue = slot.value.toLowerCase();
    return slotValue;
  } else {
    //we didn't get a value in the slot.
    return false;
  }
}

function getChannel(searchValue) {
  var hay = vrtRadioChannel;

  for(var attributeName in hay){
    //console.log(attributeName+": " + JSON.stringify(hay[attributeName]));
    if (hay[attributeName].speech.input.indexOf(searchValue) > -1) {
      return hay[attributeName];
    }
  }
}

function httpsGetVrtService(myRequest, callback, handlerObject) {
  var onairData = "";

  var tmpService = {};

  if (typeof myRequest.service != 'undefined' && myRequest.service == 'playlistOnair') {
      tmpService = Object.assign({}, vrtService.playlistOnair);
      // Add filter to request.
      tmpService.path += '?channel_code=' + myRequest.channel.code;
  }

  if (Object.keys(tmpService).length != 0 && tmpService.constructor === Object) {
    // Handle HTTPS request.
    var httpsPromise = new Promise( function(resolve, reject){
      var req = https.request(tmpService, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(dataChunk) {
          onairData += dataChunk;
        });
        res.on('end', function() {
          resolve(onairData);
        });
      });
      req.on('error', function(e) {
        console.error('ERROR "https.request()"', e);
        reject(e);
      });
      req.end();
    });
    httpsPromise.then(
      function (data) {
        callback(data, myRequest, handlerObject);
      },
      function (err) {
        console.error('ERROR "httpsPromise rejected https.request()":', err);
      }
    ).catch(function (err) {
      console.error('ERROR "httpsPromise error in callback())"', err);
    });

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
  var onairSong = {};

  if (requestedOnairType.toLowerCase() == 'current') {
    onairSong = getVrtOnairSongByType(onairData, 'NOW');
  }
  else if (requestedOnairType.toLowerCase() == 'previous') {
    onairSong = getVrtOnairSongByType(onairData, 'PREVIOUS');
  }
  else if (requestedOnairType.toLowerCase() == 'next') {
    onairSong = getVrtOnairSongByType(onairData, 'NEXT');
  }
  else if (requestedOnairType.toLowerCase() == 'latest') {
    onairSong = getVrtOnairSongByType(onairData, 'NOW');
    if (Object.keys(onairSong).length === 0 && onairSong.constructor === Object) {
      onairSong = getVrtOnairSongByType(onairData, 'PREVIOUS');
    }
  }
  else {
    //@todo throw error / trigger something.
  }

  return onairSong;
}

function getVrtOnairSongByType(onairData, onairType) {
  var onairSong = {};
  onairData.onairs.forEach(function(element){
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
    'reqChannel': myRequest.channel.speech.output,
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
  if (myResult.req.mainType == 'song' || myResult.req.mainType == 'all') {
    if (myResult.req.mainType == 'all') {
      speechOutput += 'The ' + speechVars.reqOnairType + ' song is ' + speechVars.title + ' ';
    }
    else {
      speechOutput += 'The ' + speechVars.reqOnairType + ' song is ' + speechVars.title + ' played by ' + speechVars.artist + '.';
    }
  }
  if (myResult.req.mainType == 'artist' || myResult.req.mainType == 'all') {
    if (myResult.req.mainType == 'all') {
      speechOutput += 'played by ' + speechVars.artist + '. ';
    }
    else {
      speechOutput += 'The artist of the ' + speechVars.reqOnairType + ' song is ' + speechVars.artist + '. ';
    }
  }
  if (myResult.req.mainType == 'composer' || myResult.req.mainType == 'all') {
    if (myResult.req.mainType == 'all') {
      speechOutput += 'And the composer is ' + speechVars.composer + '. ';
    }
    else {
      speechOutput += 'The composer of the ' + speechVars.reqOnairType + ' song is ' + speechVars.composer + '.';
    }
  }

  return speechOutput;
}