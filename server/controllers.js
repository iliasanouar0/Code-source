const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const fs = require('fs')
const { google } = require("googleapis");
const resultsManager = require('./managers/resultManager')
const cloudProcessManager = require('./managers/cloudProcessManager');
const ejs = require('ejs');
const { log } = require("handlebars");


require("dotenv").config();


// const oAuth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI
// );


async function sendMail(req, res) {
    let results = []
    let Obj = (req.params.p)
    await cloudProcessManager.startedProcess({ status: 'RUNNING', id_process: Obj })
    console.log(Obj);
    let data = await cloudProcessManager.getAllProcessSeedsProject(Obj)
    console.log(data);

    console.log(data[0].client_id)
    console.log(data[0].client_secret);
    console.log(data[0].redirect_url);

    const oAuth2Client = new google.auth.OAuth2(
        data[0].client_id,
        data[0].client_secret,
        data[0].redirect_url
    );

    let actions = data[0].action
        , subject
        , to
        , limit
        , methods = { fixedLimit: false }
        , test = { sendWithAll: false }

    if (actions.indexOf('subject') == -1 && actions.indexOf('to') == -1 && actions.indexOf('limit') == -1 && actions.indexOf('Fixed') == -1 && actions.indexOf('all') == -1) {
        actions = [actions]
    } else {
        actions = actions.split(',')
        let length = actions.length
        for (let i = 0; i < length; i++) {
            switch (actions[length - (i + 1)].split(':')[0]) {
                case 'Fixed':
                    actions.pop()
                    methods.fixedLimit = true
                    break;
                case 'all':
                    actions.pop()
                    test.sendWithAll = true
                    break;
                case 'limit':
                    limit = actions.pop().split(':')[1]
                    break;
                case 'to':
                    to = actions.pop().split(':')[1]
                    break;
                case 'subject':
                    subject = actions.pop().split(':')[1]
                    break;
                default:
                    break;
            }
        }
    }

    console.log('to : ' + to);
    console.log('subject : ' + subject);
    console.log('test all : ' + test.sendWithAll);
    console.log('fixedLimit : ' + methods.fixedLimit);
    console.log(actions);
    let offer = fs.readFileSync(`/home/offers/${data[0].offer}`, { encoding: 'utf8' })
    console.log(offer);
    switch (actions[0]) {
        case 'test-Send':
            if (test.sendWithAll) {
                for (let i = 0; i < data.length; i++) {
                    try {
                        oAuth2Client.setCredentials({ refresh_token: data[i].refresh_token });
                        const accessToken = await oAuth2Client.getAccessToken();
                        const transport = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                // ...CONSTANTS.auth,
                                type: "OAuth2",
                                clientId: data[i].client_id,
                                clientSecret: data[i].client_secret,
                                user: data[i].gmail,
                                refreshToken: data[i].refresh_token,
                                accessToken: accessToken,
                            },
                        });
                        const mailOptions = {
                            from: data[i].gmail,
                            to: to,
                            subject: subject,
                            html: ejs.render(fs.readFileSync(`/home/offers/${data[0].offer}`, 'utf-8')),
                        };
                        const result = await transport.sendMail(mailOptions);
                        results.push(result)
                    } catch (error) {
                        console.log(error);
                        res.send(error);
                    }
                }
            } else {
                try {
                    oAuth2Client.setCredentials({ refresh_token: data[0].refresh_token });
                    const accessToken = await oAuth2Client.getAccessToken();
                    const transport = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            // ...CONSTANTS.auth,
                            type: "OAuth2",
                            clientId: data[0].client_id,
                            clientSecret: data[0].client_secret,
                            user: data[0].gmail,
                            refreshToken: data[0].refresh_token,
                            accessToken: accessToken,
                        },
                    });
                    const mailOptions = {
                        from: data[0].gmail,
                        to: to,
                        subject: subject,
                        text: 'text',
                    };
                    const result = await transport.sendMail(mailOptions);
                    results.push(result)
                } catch (error) {
                    console.log(error);
                    res.send(error);
                }
            }
            break;
        case 'Send':
            console.log(actions);
            break;
        default:
            console.log('invalid data');
            break;
    }
    cloudProcessManager.finishedProcess({ status: 'FINISHED', id_process: Obj })
    console.log(results);
    res.status(200).send(results)
}

async function getUser(req, res) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        console.log(token);
        const config = generateConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

async function getDrafts(req, res) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function readMail(req, res) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/iliasanouar0@gmail.com/messages/${req.params.messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);

        let data = await response.data;

        res.json(data);
    } catch (error) {
        res.send(error);
    }
}

module.exports = {
    getUser,
    sendMail,
    getDrafts,
    readMail,
};
