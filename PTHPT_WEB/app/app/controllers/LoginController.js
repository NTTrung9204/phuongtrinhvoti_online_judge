const User = require('../models/register');
const Handlebars = require('handlebars');
const activePage = 6

class LoginController {

    index(req, res, next) {
        const user = req.session
        res.render('register/login',{user, activePage});
    }

    login(req, res) {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user.password == req.body.password) {
                    req.session.username = user.username;
                    req.session._id = user._id;
                    req.session.role = user.role;
                    req.session.avatar = user.avatar;
                    req.session.deleted = user.deleted;
		    if(user.announcement.length == 0){
			let announce = {
			    title: "Chào mừng thành viên mới!",
                            time: "19/02/2024",
                            icon: "users"     
			}
			req.session.announcement = [announce];
		    }
		    else {
			req.session.announcement = user.announcement.length < 10? user.announcement.reverse() : user.announcement.slice(user.announcement.length - 10).reverse();
		    }
                    req.session.isNew = user.isNew
                    res.redirect("/")
                }
                else {
                    res.render("register/login", { error: "Tài Khoản Hoặc Mật Khẩu Không Chính Xác" , activePage});
                }
            })
            .catch(() => {
                res.render("register/login", { error: "Tài Khoản Hoặc Mật Khẩu Không Đúng" , activePage})
            })
    }


}

module.exports = new LoginController;
