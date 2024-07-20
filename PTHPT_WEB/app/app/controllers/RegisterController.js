const User = require('../models/register');
const activePage = 7
function generateRandomNumber() {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class RegisterController {

    index(req, res, next) {
        res.render('register/register', {activePage});
    }

    register(req, res, next) {

        var flag = true;
        if ((req.body.username && req.body.email && req.body.password) != "") {
            if(req.body.enterthepassword != req.body.password){
                res.render("register/register", { errorpassword: "Mật khẩu không khớp", activePage});
            }
            else{
                if(req.body.username.length > 16 || req.body.username.length < 5){
                    res.render("register/register", { errorusername: "Tên đăng nhập phải từ 5 đến 16 kí tự", activePage});
                }
                else{
                    User.find()
                        .then(user => {
                            for (var i = 0; i < user.length; i++) {
                                if (req.body.username == user[i].username) {
                                    res.render("register/register", { errorusername: "Tên Đăng Nhập Tồn Tại", activePage});
                                    flag = false;
                                }
                                if (req.body.email == user[i].email) {
                                    res.render("register/register", { erroremail: "Email Đã Được Sử Dụng", activePage});
                                    flag = false;
                                }
                            }
                            if (flag == true) {
                                const passcode = generateRandomNumber()
                                req.session.passcode = passcode;
                                req.session.username = req.body.username;
                                req.session.password = req.body.password;
                                req.session.email = req.body.email;
                                res.redirect('/sendMail')
                            }
                        })
                        .catch(next)
                }
            }
        }
        else {
            console.log("Insert Fail !!!");
        }
    }

    check(req, res, next){
        if(req.session.passcode){
            res.render('register/check')
        }
        else{
            res.redirect('/')
        }
    }

    checkPasscode(req, res, next){
        if(req.session.passcode == req.body.passcode){
            req.session.passcode = ''
            User.create({username: req.session.username_temp, email: req.session.email, password: req.session.password, avatar: "defaultAvatar.png", role: (req.session.username == 'NTTrung9204')? "admin" : "user"})
            .then(()=>{
                    req.session.email = ''
		    req.session.username = ''
                    res.redirect('/login?checkRegister=true')
                })
                .catch()
        }
        else{
            res.render('register/check', {errorPasscode: "Mã xác nhận không đúng!"})
        }
    }




}

module.exports = new RegisterController;
