const Announcement = require('../models/Announcement');
const listUser = require('../models/register');
const activePage = 0
function objectId() {
    return hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}
function hex(value) {
    return Math.floor(value).toString(16)
}
class about {

    // [GET] /announcement/:_id
    index(req, res, next) {
        const user = req.session
        const role = req.session.role
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            Announcement.find()
                .then(Announcement => {
                    Announcement = Announcement.map(Announcement => Announcement.toJSON());
                    var mainAnnouncement
                    for(let index = 0; index < Announcement.length; index++){
                        if(Announcement[index]._id == req.params._id){
                            mainAnnouncement = Announcement[index]
                            mainAnnouncement.index = index
                            break
                        }
                    }
                    (mainAnnouncement.likes.includes(user.username))? mainAnnouncement.lliked = 1 : mainAnnouncement.lliked = 0
                    
                    for(let i = 0; i < mainAnnouncement.comment.length; i++){
                        if(!mainAnnouncement.comment[i].deleted) {
                            mainAnnouncement.comment[i].isLike = (mainAnnouncement.comment[i].liked.includes(user.username)) ? 1 : 0
                    
                            for(let j = 0; j < mainAnnouncement.comment[i].commentChild.length; j++){
                                if(!mainAnnouncement.comment[i].commentChild[j].deleted){
                                    mainAnnouncement.comment[i].commentChild[j].isLike = (mainAnnouncement.comment[i].commentChild[j].liked.includes(user.username))? 1 : 0
                                    
                                }
                            }
                        }
                    }
    
                    var listOfNames = []
                    for(let comment of mainAnnouncement.comment){
                        listOfNames.includes(comment.au) ? 1 : listOfNames.push(comment.au);
                        for(let commentChild of comment.commentChild){
                            listOfNames.includes(commentChild.au) ? 1 : listOfNames.push(commentChild.au);
                        }
                    }
    
                    listUser.find()
                        .then(listUser => {
                            listUser = listUser.map(listUser => listUser.toJSON())
                            var filteredUsers = listUser.filter(function(user) {
                                return listOfNames.includes(user.username);
                            });
    
                            for(let comment of mainAnnouncement.comment){
                                let inforUser = filteredUsers.filter(user => user.username == comment.au)
                                comment.avatar = inforUser[0].avatar
                                comment.idAuthor = inforUser[0]._id
                                comment.color = inforUser[0].color
                                comment.position = inforUser[0].position
                                comment.score = inforUser[0].score
                                comment.role = inforUser[0].role
                                for(let commentChild of comment.commentChild){
                                    let inforUser = filteredUsers.filter(user => user.username == commentChild.au)
                                    commentChild.avatar = inforUser[0].avatar
                                    commentChild.idAuthor = inforUser[0]._id
                                    commentChild.color = inforUser[0].color
                                    commentChild.position = inforUser[0].position
                                    commentChild.score = inforUser[0].score
                                    commentChild.role = inforUser[0].role
                                }
                            }
    
                            
                            res.render('Announcement/announcement', {mainAnnouncement, user, role, activePage});
                        })
                        .catch()
    
    
                })
                .catch(next);
        }
    }

    // [POST] /announcement/:_id
    comment(req, res, next) {
        Announcement.findOne({ _id: req.params._id })
            .then(Announcement => {
                if (req.body.cmt_id) {
                    for (let i = 1; i <= Object.keys(Announcement.comment).length; i++) {
                        if (Announcement.comment[i].cmt_id == req.body.cmt_id) {
                            let index = 0
                            if (Announcement.comment[i].commentChild) {
                                index = Object.keys(Announcement.comment[i].commentChild).length
                            }
                            if (index == 0) {
                                var NewEle = {}
                                NewEle['1'] = {
                                    cmt: req.body.comment,
                                    au: req.session.username,
                                    date: Date(),
                                    cmtChild_id: objectId(),
                                    deleted: 0,
                                    deleteAt: "",
                                    likes: 0,
                                    liked: [],
                                    image: (req.file) ? req.file.filename : ""
                                }
                                Announcement.comment[i].commentChild = NewEle
                            }
                            else {
                                Announcement.comment[i].commentChild[index + 1] = {
                                    cmt: req.body.comment,
                                    au: req.session.username,
                                    date: Date(),
                                    cmtChild_id: objectId(),
                                    deleted: 0,
                                    deleteAt: "",
                                    likes: 0,
                                    liked: [],
                                    image: (req.file) ? req.file.filename : ""
                                }
                            }
                            Announcement.markModified('comment');
                            Announcement.save()
                                .then(() => {
                                    res.redirect('/announcement/' + req.params._id)
                                })
                                .catch()

                        }
                    }
                }
                else {
                    let index = 0

                    if (Announcement.comment) {
                        index = Object.keys(Announcement.comment).length
                    }
                    if (index == 0) {
                        var NewEle = {}
                        NewEle['1'] = {
                            cmt: req.body.comment,
                            au: req.session.username,
                            date: Date(),
                            cmt_id: objectId(),
                            deleted: 0,
                            deleteAt: "",
                            likes: 0,
                            liked: [],
                            image: (req.file) ? req.file.filename : ""
                        }
                        Announcement.comment = NewEle
                    }
                    else {
                        Announcement.comment[index + 1] = {
                            cmt: req.body.comment,
                            au: req.session.username,
                            date: Date(),
                            cmt_id: objectId(),
                            deleted: 0,
                            deleteAt: "",
                            likes: 0,
                            liked: [],
                            image: (req.file) ? req.file.filename : ""
                        }
                    }
                    Announcement.markModified('comment');
                    Announcement.save()
                        .then(() => {
                            res.redirect('/announcement/' + req.params._id)
                        })
                        .catch()
                }
            })
            .catch(next)
    }

    delete(req, res, next) {
        Announcement.findOne({ _id: req.params._id })
            .then(Announcement => {
                if (req.params.cmtChild_id.length >= 20) {
                    for (let i = 1; i <= Object.keys(Announcement.comment).length; i++) {
                        if (Announcement.comment[i].cmt_id == req.params.cmt_id) {
                            for (let j = 1; j <= Object.keys(Announcement.comment[i].commentChild).length; j++) {
                                if (Announcement.comment[i].commentChild[j].cmtChild_id == req.params.cmtChild_id) {
                                    Announcement.comment[i].commentChild[j].likes += 1;
                                    Announcement.comment[i].commentChild[j].deleteAt = Date();
                                    Announcement.markModified('comment');
                                    Announcement.save()
                                        .then(() => {
                                            res.redirect('/announcement/' + req.params._id)
                                        })
                                        .catch()
                                }
                            }
                        }
                    }
                }
                else {
                    for (let i = 1; i <= Object.keys(Announcement.comment).length; i++) {
                        if (Announcement.comment[i].cmt_id == req.params.cmt_id) {
                            Announcement.comment[i].deleted = 1
                            Announcement.comment[i].deleteAt = Date()
                            Announcement.markModified('comment');
                            Announcement.save()
                                .then(() => {
                                    res.redirect('/announcement/' + req.params._id)
                                })
                                .catch()
                        }
                    }
                }
            })
            .catch(next)
    }

    like(req, res, next) {
        Announcement.findOne({ _id: req.params._id })
            .then(Announcement => {
                if (req.params.cmtChild_id.length >= 20) {
                    for (let i = 1; i <= Object.keys(Announcement.comment).length; i++) {
                        if (Announcement.comment[i].cmt_id == req.params.cmt_id) {
                            for (let j = 1; j <= Object.keys(Announcement.comment[i].commentChild).length; j++) {
                                if (Announcement.comment[i].commentChild[j].cmtChild_id == req.params.cmtChild_id) {
                                    let flag = false
                                    for (let k of Announcement.comment[i].commentChild[j].liked) {
                                        if (k == req.session.username) {
                                            flag = true
                                            break
                                        }
                                    }
                                    if (flag == true) {
                                        Announcement.comment[i].commentChild[j].likes -= 1
                                        Announcement.comment[i].commentChild[j].liked =
                                            Announcement.comment[i].commentChild[j].liked.filter(item => item !== req.session.username)
                                    }
                                    else {
                                        Announcement.comment[i].commentChild[j].likes += 1
                                        Announcement.comment[i].commentChild[j].liked.push(req.session.username)
                                    }
                                    Announcement.markModified('comment');
                                    Announcement.save()
                                        .then(() => {
                                            res.redirect('/announcement/' + req.params._id)
                                        })
                                        .catch()
                                }
                            }

                        }
                    }
                }
                else {
                    for (let i = 1; i <= Object.keys(Announcement.comment).length; i++) {
                        if (Announcement.comment[i].cmt_id == req.params.cmt_id) {
                            let flag = false
                            for (let k of Announcement.comment[i].liked) {
                                if (k == req.session.username) {
                                    flag = true
                                    break
                                }
                            }
                            if (flag == true) {
                                Announcement.comment[i].likes -= 1
                                Announcement.comment[i].liked =
                                    Announcement.comment[i].liked.filter(item => item !== req.session.username)
                            }
                            else {
                                Announcement.comment[i].likes += 1
                                Announcement.comment[i].liked.push(req.session.username)
                            }
                            Announcement.markModified('comment');
                            Announcement.save()
                                .then(() => {
                                    res.redirect('/announcement/' + req.params._id)
                                })
                                .catch()
                        }
                    }
                }
            })
            .catch(next)
    }

}

module.exports = new about;
