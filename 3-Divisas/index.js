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
      WELCOME_MSG: 'Welcome to the Currency Converter, try "pass 10 dollars to pesos"',
      GDBYE: 'Goodbye'
    }
  },
  es: {
    translation: {
      WELCOME_MSG: 'Bienvenido al Convertidor de divisas, intente con "pasa 10 dolares a pesos"',
      GDBYE: 'Nos Vemos'
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

const ConvertirDivisaIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DivisaIntent';
  },
  handle(handlerInput) {
    const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
    const divisaOrigen = handlerInput.requestEnvelope.request.intent.slots.divisa_origen.value;
    const divisaDestino = handlerInput.requestEnvelope.request.intent.slots.divisa_destino.value;


     let tipoCambio;
    
     switch(divisaOrigen){
        case "pesos":
            if(divisaDestino === "dolares"){
                 tipoCambio = 0.057;
             }else if(divisaDestino === "euros"){
                 tipoCambio = 0.053;
             }
             break;
            
         case "dolares":
            if(divisaDestino === "pesos"){
                 tipoCambio = 17.50;
             }else if(divisaDestino === "euros"){
                 tipoCambio = 0.92;
             }
             break;
         case "dollars":
             if(divisaDestino === "pesos"){
                 tipoCambio = 17.50;
             }else if(divisaDestino === "euros"){
                 tipoCambio = 0.92;
             }
             break;
         case "euros":
             if(divisaDestino === "pesos"){
                 tipoCambio = 19;
             }else if(divisaDestino === "dolares"){
                 tipoCambio = 1.09;
             }
             break;
         default:
         response = "moneda no valida";
     }

    let response;
    if (cantidad >= 1) {
      const cantidadConvertida = cantidad * tipoCambio;
      console.log(cantidadConvertida);
      response = `La cantidad es ${cantidadConvertida} ${divisaDestino}`;
    } else if (cantidad <= 0) {
      response = 'Ingrese una cantidad mayor a 1';
    } else {
      response = 'Moneda no válida';
    }

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
    const speakOutput = 'You can say hello to me! How can I help?';
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

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  }
};

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

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

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ConvertirDivisaIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
  .addResponseInterceptors(LoggingResponseInterceptor)
  .withCustomUserAgent('sample/hello-world/v1.2')
  .lambda();
