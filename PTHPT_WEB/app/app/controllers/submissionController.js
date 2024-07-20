const submission = require('../models/submission');
const listUser = require('../models/register');
const activePage = 2
const pageAmount = 50
class submissionController {

    // [GET] /
    index(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.render('/')
        }
        else{
            submission.find()
                .then(submission => {
                    listUser.find()
                        .then(listUser => {
                            listUser = listUser.map(listUser => listUser.toJSON())
                            submission = submission.map(submission => submission.toJSON())
                            submission.reverse()
    
                            const amountSibmission = submission.length;
                            let pagination = amountSibmission / pageAmount + 1
                            let index = 0
                            let listOfNames = []
    
    
                            let page = req.params.page
    
                            page = (typeof page == 'undefined') ? 0 : Number(page)
    
                            if (Number.isInteger(page)) {
                                if (page > amountSibmission / pageAmount) {
                                    res.redirect("/submission")
                                }
                                else{
                                    for (let submit of submission) {
                                        submit.id = amountSibmission - index++;
                                    }
                                    submission = submission.slice(page * pageAmount, (page + 1) * pageAmount)
                                    for (let submit of submission) {
                                        listOfNames.includes(submit.applicant) ? 1 : listOfNames.push(submit.applicant);
                                    }
            
                                    var filteredUsers = listUser.filter(function (user) {
                                        return listOfNames.includes(user.username);
                                    });
            
                                    for (let submit of submission) {
                                        let inforUser = filteredUsers.filter(user => user.username == submit.applicant)
                                        submit.idALC = inforUser[0]._id
                                        submit.color = inforUser[0].color
                                        submit.role = inforUser[0].role
                                        submit.fontWeight = inforUser[0].fontWeight
                                    }
                                    if(pagination > 10) pagination = 10;
                                    let paginationLoop = Array.from({ length: pagination }, (_, index) => index + 1);
                                    res.render('submission/submission', {activePage, submission, user, page : page + 1, paginationLoop})
                                }
                            }
                            else{
                                res.redirect("/submission")
                            }
                            
                        })
                        .catch()
                })
                .catch()
        }
    }

}

module.exports = new submissionController;
