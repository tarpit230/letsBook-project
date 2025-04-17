require("dotenv").config;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

 const googleTokenVerification = async (req, res) => {
    const { token } = req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload();
        return res.status(200).json({
            loggedIn: true,
            name: payload.name,
            email: payload.email,
        })
    } catch (err) {
        res.json(400).json({
            loggedIn: false,
            error: err,
        })
    }
    
}

module.exports = {
    googleTokenVerification,
}