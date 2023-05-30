/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require("i18next");
const sprintf = require("i18next-sprintf-postprocessor");

const languageStrings = {
  en: {
    translation: {
      WELCOME_MSG: 'Welcome to the calculator, which operation do you want? try "5 plus 5"',
      GDBYE: 'Goodbye',
      CALCULAD: `The answer is %s`,
      HELPP:'You can say hello to me! How can I help?'
    }
  },
  es: {
    translation: {
      WELCOME_MSG: 'Bienvenido a la calculadora, Que operacion desea? intente con "5 mas 5"',
      GDBYE: 'Nos Vemos',
      CALCULAD: `La respuesta es %s`,
      HELPP:'¡Puedes saludarme! ¿Cómo puedo ayudar?'
    }
  }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributtes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributtes.t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OperacionHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OperacionIntent';
    },
    handle(handlerInput){
        const requestAttributtes = handlerInput.attributesManager.getRequestAttributes();
        const num1 = handlerInput.requestEnvelope.request.intent.slots.num.value;
        const num2 = handlerInput.requestEnvelope.request.intent.slots.numd.value;
        let opera = handlerInput.requestEnvelope.request.intent.slots.operacion.value;
        let response;

        if(num1 <= 0 || num2 <= 0){
            let response = "Los numeros tiene que ser mayor a 1";
            
            return handlerInput.responseBuilder
                .speak(response)
                .getResponse();
        }
        
        let respuest;
        switch(opera){
            case "suma":
            case "mas":
            case "plus":
                respuest = parseInt(num1) + parseInt(num2);
            break;
            case "resta":
            case "menos":
            case "minus":
                respuest = parseInt(num1) - parseInt(num2);
            break;
            case "divide":
            case "division":
            case "entre":
            case "divided":
                respuest = parseInt(num1) / parseInt(num2);
            break;
            case "multiplica":
            case "multiplicacion":
            case "por":
            case "times":
                respuest = parseInt(num1) * parseInt(num2);
            break;
        }
        
        if(opera==="mas"){
            opera = "suma";
        }else if(opera==="menos"){
            opera = "resta";
        }else if(opera==="entre"){
            opera = "division";
        }else if(opera==="por"){
            opera = "multiplicacion";
        }else if(opera==="plus"){
            opera = "addition";
        }else if(opera==="minus"){
            opera = "subtraction";
        }else if(opera==="divided by"){
            opera = "division";
        }else if(opera==="times"){
            opera = "multiplication";
        }
        

        response = requestAttributtes.t('CALCULAD' , respuest);

    return handlerInput.responseBuilder
      .speak(response)
      .reprompt(response)
      .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributtes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributtes.t('HELPP');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributtes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributtes.t('GDBYE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
  process(handlerInput) {
    console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
  }
};

const LoggingResponseInterceptor = {
  process(handlerInput, response) {
    console.log(`Outgoing response: ${JSON.stringify(response)}`);
  }
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        OperacionHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();