const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')
const GOOGLE_MAILER_CLIENT_ID = '***'
const GOOGLE_MAILER_CLIENT_SECRET = '***'
const GOOGLE_MAILER_REFRESH_TOKEN = '***'
const ADMIN_EMAIL_ADDRESS = '***'
const myOAuth2Client = new OAuth2Client(
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET
)


myOAuth2Client.setCredentials({
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

let sendMail = async (req, res) => {
    if(req.session.email){
        const passcode = req.session.passcode
        const username = req.session.username
        const email = req.session.email
        console.log(passcode, email)
        try {
            const myAccessTokenObject = await myOAuth2Client.getAccessToken()
            const myAccessToken = myAccessTokenObject?.token
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: ADMIN_EMAIL_ADDRESS,
                    clientId: GOOGLE_MAILER_CLIENT_ID,
                    clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
                    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
                    accessToken: myAccessToken
                }
            })
    
            const mailOptions = {
                to: email,
                subject: `Mail xác nhận tài khoản`,
                html: `
                    <h3>Xin chào ${username}, cảm ơn bạn đã đăng ký tài khoản trên website của chúng tôi.</h3>
                    <h3>Hãy sử dụng mã này để xác thực tài khoản.</h3>
                    <h1 style="text-align: center; color: #007BFF;">${passcode}</h1>
                    <h3>Trân trọng</h3>
                `
            }
            await transport.sendMail(mailOptions)
            req.session.username_temp = req.session.username
	        req.session.username = ""
            res.redirect('/register/check')
        } catch (error) {
            console.log(error)
	    req.session.username = ""
            res.render('deletedAccount/tokenMailExpire', {username})
        }
    }
    else{
        res.redirect('/register')
    }
}

module.exports = {
    sendMail: sendMail
}
