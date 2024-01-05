require("dotenv").config();

const auth = {
    type: "OAuth2",
    // user: "ilyasanouar01@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
    from: "THE-ONE <ilyasanouar01@gmail.com>",
    to: "iliasanouar0@gmail.com",
    subject: "Gmail API NodeJS",
};

module.exports = {
    auth,
    mailoptions,
};