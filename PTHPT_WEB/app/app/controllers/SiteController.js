const Announcement = require('../models/Announcement');
const listUser = require('../models/register');
const ContestProblem = require('../models/contest');
const activePage = 0
var n = 1600;
class SiteController {
    // [GET] /
    index(req, res, next) {
        const user = req.session;
	console.log(++n, user.username);
        if(user.deleted == '1') {
            res.render('deletedAccount/deletedAccount')
        }
        else{
            Announcement.find()
                .then( Announcement =>{
                    Announcement = Announcement.map(Announcement => Announcement.toJSON());
                    Announcement = Announcement.filter(item => item.deleted != 1)
                    listUser.find()
                        .then(listUser => {
                            listUser = listUser.map(listUser => listUser.toJSON());
                            listUser.sort((a, b) => b.score - a.score);
                            listUser = listUser.slice(0, Math.min(10, listUser.length))
                            ContestProblem.find()
                                .then(ContestProblem =>{
                                    ContestProblem = ContestProblem.map(ContestProblem => ContestProblem.toJSON());
                                    ContestProblem = ContestProblem.filter(ContestProblem => ContestProblem.status == 0)
                                    ContestProblem.reverse();
                                    ContestProblem = ContestProblem.slice(0, Math.min(10, ContestProblem.length))
    
                                    for(let index = 0; index < Announcement.length; index++){
                                        if(Announcement[index].likes.includes(user.username)){
                                            Announcement[index].lliked = 1
                                        }
                                        else{
                                            Announcement[index].lliked = 0
                                        }
                                    }
    
                                    Announcement.reverse()
    
                                    res.render('home',{Announcement, user, listUser, ContestProblem, activePage, n})
                                })
                                .catch(next)
                        })
                        .catch(next)
                })
                .catch(next);
        }
    }
}

module.exports = new SiteController;
