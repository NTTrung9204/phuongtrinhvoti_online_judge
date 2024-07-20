const User = require('../models/register');
const activePage = 3
const memberAmount = 100
class Assignment {

    // [GET] /
    index(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            User.find()
                .then(listUser => {
                    listUser = listUser.map(listUser => listUser.toJSON());
                    let page = req.params.page
                    const totalMember = listUser.length;
                    (typeof page == 'undefined')? page = 0 : page = Number(page);
                    if(Number.isInteger(page)){
                        const pagination = totalMember / memberAmount
                        if(page > pagination){
                            res.redirect("/member")
                        }
                        else{
                            listUser.sort(function (a, b) {
                                return b.score - a.score;
                            })
                            let index = 1
                            for(let user of listUser){
                                user.index = index++;
                                user.AmountGolden = user.goldenMedal.length
                                user.AmountSilver = user.silverMedal.length
                                user.AmountBrozen = user.bronzeMedal.length
                            }
                            listUser = listUser.slice(page * memberAmount, (page + 1) * memberAmount)
                            let paginationLoop = Array.from({ length: pagination + 1 }, (_, index) => index + 1);
                            res.render('member/member',{user, listUser, activePage, paginationLoop, page : page + 1})
                        }
                    }
                    else{
                        res.redirect("/member")
                    }
                })
                .catch()
        }
    }

}

module.exports = new Assignment;
