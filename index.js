/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes');
var lengthSlot;
var lengthName;

var APP_ID = "amzn1.echo-sdk-ams.app.d5cd74c4-4884-41fe-a8af-d9330a2fd53e";

/**
 * Mindfulness is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Mindfulness = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Mindfulness.prototype = Object.create(AlexaSkill.prototype);
Mindfulness.prototype.constructor = Mindfulness;

Mindfulness.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the 1-Minute Mindfulness Skill. Mindfulness is the practice of purposely focusing your attention on the present moment, and accepting it without judgment. Even 1 minute will bring the benefit of mindfulness to your life. You can say minute, waves, forest or river. Which meditation would you like?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

Mindfulness.prototype.intentHandlers = {
    "MinuteMeditationIntent": function (intent, session, response) {
        lengthSlot = intent.slots.Length;
		if (lengthSlot && lengthSlot.value){
			lengthName = lengthSlot.value.toLowerCase();
		}
				
        var recipe = recipes[lengthName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: "<speak> Your meditation is about to begin. As the music plays, take a moment to calm your mind and focus on your breath. " + recipe + " Would you like to continue? You can say yes, or you can say cancel.</speak>",
                type: AlexaSkill.speechOutputType.SSML
            };
            response.ask(speechOutput, "Would you like to continue? You can say yes, or you can say cancel.");
        } else {
            var speech;
            if (lengthName) {
                speech = "I'm sorry, I currently do not have a meditation for " + lengthName + " You can say minute, waves, forest or river. Which meditation would you like? ";
            } else {
                speech = "I'm sorry, I currently do not have a meditation that matches your request. You can say minute, waves, forest or river. Which meditation would you like?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "You can say minute, waves, forest or river. Which meditation would you like?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Peace be with you, until next time.";
        response.tell(speechOutput);
    },
	"AMAZON.YesIntent": function (intent, session, response) {
		if (lengthSlot && lengthSlot.value){
			lengthName = lengthSlot.value.toLowerCase();
		}
				
        var recipe = recipes[lengthName];
        var cardTitle = "1 Minute Mindfulness"
        var repromptSpeech = "Would you like to continue? You can say yes, or you can say cancel.",
            cardContent = "Congratulations! You are changing the world, one meditation at a time. Visit us anytime at WalkingAffirmations.com!",
            speechOutput = {
                speech: "<speak> " + recipe + " Would you like to continue? You can say yes, or you can say cancel.</speak>",
                type: AlexaSkill.speechOutputType.SSML
            };
            response.askWithCard(speechOutput, repromptSpeech, cardTitle, cardContent);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Thank you for using the 1 minute mindfulness skill. Take a deep breath, smile, and enjoy the rest of your day."
        response.tellWithCard(speechOutput, "Mindfulness Meditation", "Congratulations! You are changing the world, one meditation at a time. Visit us anytime at WalkingAffirmations.com!");
    },
    "AMAZON.NoIntent": function (intent, session, response) {
        var speechOutput = "Thank you for using the 1 minute mindfulness skill. Take a deep breath, smile, and enjoy the rest of your day."
        response.tellWithCard(speechOutput, "Mindfulness Meditation", "Congratulations! You are changing the world, one meditation at a time. Visit us anytime at WalkingAffirmations.com!");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "1 Minute Mindfulness will help you take a quick break from the world around you and guide you on a one minute journey into mindfulness. Mindfulness is the practice of purposely focusing your attention on the present moment, and accepting it without judgment. This meditation lasts for 1 minute, but you will be prompted to add an additional minute until you exit. As your meditation begins, music will begin to play. Take a moment to sit down and close your eyes. Focus your attention on your breath. Focus on each inhalation and exhalation, and if your mind wanders, don't judge it, just return your focus to your breath. When the music stops, your meditation is complete. In order to begin you can say things like, start a peaceful meditation, start a forest meditation, or cancel.  How can I help you?";
        var repromptText = "You can say things like, start a peaceful meditation, start a forest meditation, or cancel.  How can I help you?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var mindfullness = new Mindfulness();
    mindfullness.execute(event, context);
};
