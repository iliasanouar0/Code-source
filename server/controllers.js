const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");
const resultsManager = require('./managers/resultManager')
const cloudProcessManager = require('./managers/cloudProcessManager');
const { logging } = require("googleapis/build/src/apis/logging");

require("dotenv").config();


// const oAuth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI
// );


async function sendMail(req, res) {
    // const oAuth2Client = new google.auth.OAuth2(
    //     process.env.CLIENT_ID,
    //     process.env.CLIENT_SECRET,
    //     process.env.REDIRECT_URI
    // );
    // let results = []
    let Obj = (req.params.p)
    console.log(Obj);
    let data = await cloudProcessManager.getAllProcessSeedsProject(Obj)
    console.log(data);
    let to
    let subject
    let bcc
    let actions = data[0].action
    console.log(actions);
    actions = actions.split(',')
    actions.shift()
    let length = actions.length
    for (let i = 0; i < length; i++) {
        console.log(actions[length - (i + 1)].split(':')[0]);
        switch (actions[length - (i + 1)].split(':')[0]) {
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
    console.log(to);
    console.log(subject);
    console.log(actions);
    res.status(200).send(data)

    // let list = processManager.getAllProcessSeeds(data.list)
    // console.log(list);
    // for (let i = 0; i < list.length; i++) {
    //     console.log(list[i]);
    //     try {
    //         oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    //         const accessToken = await oAuth2Client.getAccessToken();
    //         const transport = nodemailer.createTransport({
    //             service: "gmail",
    //             auth: {
    //                 ...CONSTANTS.auth,
    //                 user: list[i].gmail,
    //                 refreshToken: list[i].REFRESH_TOKEN,
    //                 accessToken: accessToken,
    //             },
    //         });
    //         const mailOptions = {
    //             // ...CONSTANTS.mailoptions,
    //             from: list[i].gmail,
    //             to: to,
    //             subject: subject,
    //             bcc: [bcc],
    //             text: text,
    //         };
    //         const result = await transport.sendMail(mailOptions);
    //         results.push(result)
    //     } catch (error) {
    //         console.log(error);
    //         res.send(error);
    //     }
    // }
    // res.status(200).send(results)
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
