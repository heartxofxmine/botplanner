var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function(session){
        session.send('Welcome! This is a BotPlanner. My goal is to help you think \
        through building a bot. I will ask a series of questions that will guide you \
        through the initial steps to take into consideration when building a bot. If \
        you are unsure about answers, simply state "I don\'t know" or "null" to move \
        on to the next question.');
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results){
        session.userData.profile = results.response;
        session.send('Congratulations! You\'ve worked your way through implementation of your first bot! Here is your Scoping Document:');
        session.send('Company: %(name)s, \n \
        The goal of your app will be %(goal)s. \n \
        It already exists on %(platforms)s.', session.userData.profile);
    }
]);

bot.dialog('/ensureProfile', [
    function(session, args, next){
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What is the name of your company?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.goal) {
            builder.Prompts.text(session, "What will be the goal of your app?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.goal = results.response;
        }
        if (!session.dialogData.profile.platforms) {
            builder.Prompts.text(session, "What platforms do you already exist on?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.platforms = results.response;
        }
        if (!session.dialogData.profile.why) {
            builder.Prompts.text(session, "Why do you want to build this Bot?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.why = results.response;
        }
        if (!session.dialogData.profile.audience) {
            builder.Prompts.text(session, "Who is your target audience?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.audience = results.response;
        }
        if (!session.dialogData.profile.problem) {
            builder.Prompts.text(session, "What will they go to this Bot to try to achieve? Take into consideration if you want to have it be exploratory, it will be hard to guide the user through a Bot experience. The Bot experience is best utilized when your user already has a problem in mind they want to solve.");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.problem = results.response;
        }
        if (!session.dialogData.profile.channels) {
            builder.Prompts.text(session, "What channels do you want this Bot to be available on?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.channels = results.response;
        }
        if (!session.dialogData.profile.integration) {
            builder.Prompts.text(session, "How do you want to incorporate this Bot with platforms you already have today? ");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.integration = results.response;
        }
        if (!session.dialogData.profile.discover) {
            builder.Prompts.text(session, "How will they find this bot if they want to achieve their task?");
        } else {
            next();
        }
    },
    function(session, results, next){
        if (results.response) {
            session.dialogData.profile.discover = results.response;
        }
        if (!session.dialogData.profile.diffExp) {
            builder.Prompts.text(session, "How will this experience be different than other platforms?");
        } else {
            next();
        }
    },
    function (session, results){
        if (results.response) {
            session.dialogData.profile.diffExp = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile});
    }
]);