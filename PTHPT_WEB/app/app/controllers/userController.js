const User = require('../models/register');
const submission = require('../models/submission');
const activePage = -1
const pageAmount = 50
function checkEmpty(...field) {
    return field.every(b => b === null || b === "" || b === 0);
  }
class userController {

    // [GET] /
    index(req, res, next) {
        const user = req.session
        try{
            if(user.deleted == '1') {
                res.redirect('/')
            }
            else{
                User.find()
                    .then(listUser => {
                        listUser = listUser.map(listUser => listUser.toJSON());
                        listUser.sort(function (a, b) {
                            return b.score - a.score;
                        });
                        var User
                        for (let i = 0; i < listUser.length; i++) {
                            if (listUser[i]._id == req.params.id) {
                                User = listUser[i]
                                User.rank = i + 1
                                break
                            }
                        }
                        if(User){
                            if(User.deleted == '1'){
                                res.render('deletedAccount/profile')
                            }
                            else{
                                const followed = (User.whoFollow.includes(user.username)) ? 1 : 0;
                                const isEmptyDesc = checkEmpty(User.descriptionA, User.descriptionB, User.imageDescription)
                                const isEmptyContact = checkEmpty(User.mail, User.youtube, User.messenger, User.discord, User.github)
                                const isEmptyMedal = checkEmpty(User.goldenMedal.length, User.silverMedal.length, User.bronzeMedal.length)
                
                
                                res.render('user/user', { User, user, followed, activePage , isEmptyDesc, isEmptyContact, isEmptyMedal})
                            }
                        }
                        else{
                            console.log("User không tồn tại!!", req.params.id)
                            res.send({"Hicc </3 User không tồn tại!! T_T": req.params.id})
                        }
                    })
                    .catch()
            }
        }
        catch(err){
            res.send({"Hicc </3 Đã có lỗi xảy ra!! T_T": err})
        }
    }

    changeAvatar(req, res, next) {
        if(req.files){
            if (req.files.length) {
                (req.files[0].fieldname == "myAvatar") ? req.body.avatar = req.files[0].filename : '';
                (req.files[0].fieldname == "myShare") ? req.body.imageDescription = req.files[0].filename : '';
            }
        }
        User.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/user/' + req.params.id)
            })
            .catch()
    }

    submission(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.render('deletedAccount/deletedAccount')
        }
        else{
            User.findById(req.params.id)
                .then(listUser => {
                    listUser = listUser.toJSON()
                    if(listUser.deleted == '1'){
                        res.render('deletedAccount/profile')
                    }
                    else{
                        submission.find({applicant: listUser.username})
                            .then(submission => {
                                submission = submission.map(submission => submission.toJSON())
                                submission.reverse()
        
                                const amountSibmission = submission.length;
                                let pagination = amountSibmission / pageAmount + 1
                                let index = 0
        
        
                                let page = req.params.page
        
                                page = (typeof page == 'undefined') ? 0 : Number(page)
        
                                if (Number.isInteger(page)) {
                                    if (page > amountSibmission / pageAmount) {
                                        res.redirect("/user/"+ req.params.id +"/submission/0")
                                    }
                                    else {
                                        for (let submit of submission) {
                                            submit.id = amountSibmission - index++;
                                        }
                                        submission = submission.slice(page * pageAmount, (page + 1) * pageAmount)
                                        const isEmpty = (submission.length == 0) ? true : false;
                                        for (let submit of submission) {
                                            submit.idALC = listUser._id
                                            submit.color = listUser.color
                                            submit.role = listUser.role
                                            submit.fontWeight = listUser.fontWeight
                                        }
                                        if (pagination > 10) pagination = 10;
                                        let paginationLoop = Array.from({ length: pagination }, (_, index) => index + 1);
                                        res.render('user/userSubmission', { activePage, submission, user, page: page + 1, paginationLoop, listUser, isEmpty})
                                    }
                                }
                                else {
                                    res.redirect("/user/"+ req.params.id +"/submission/0")
                                }
        
                            })
                            .catch()
                    }
                })
                .catch()
        }
    }

}

module.exports = new userController;
