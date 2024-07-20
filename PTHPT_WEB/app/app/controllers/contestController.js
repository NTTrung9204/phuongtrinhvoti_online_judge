const { connect } = require('mongoose');
const ContestProblem = require('../models/contest');
const listUser = require('../models/register');
const CryptoJS = require("crypto-js");
const activePage = 4

function hashString(inputString) {
  const hashedString = CryptoJS.SHA256(inputString);
  return hashedString.toString(CryptoJS.enc.Hex);
}

class Contest {
    // [GET] /
    index(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            ContestProblem.find()
                .then(ContestProblem => {
                    let CurrentContest = []
                    let OldContest = []
                    let CommingContest = []
                    ContestProblem = ContestProblem.map(ContestProblem => ContestProblem.toJSON());
                    for (let Contest of ContestProblem) {
                        if (Contest.status == 1) {
                            CurrentContest.push(Contest)
                        }
                        if (Contest.status == 2) {
                            Contest.AmountQuest = Contest.problems.length
                            CommingContest.push(Contest)
                        }
                        if (Contest.status == 0) {
                            OldContest.push(Contest)
                        }
                    }
                    OldContest.reverse()
                    const lengthOldContest = OldContest.length
                    res.render('contest/contest', { user, CurrentContest, OldContest, activePage, CommingContest, lengthOldContest})
                })
                .catch(next)
        }
    }

    layout(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            if(user.username){
                ContestProblem.findById(req.params._id)
                    .then(ContestProblem => {
                        if (ContestProblem.status == '1') {
                            const isPassword = (ContestProblem.password) ? true : false
                            if(req.query.password == req.session.passwordContest){
                                req.session.passwordContest = ''
                            }
                            if(req.session.passwordContest && !req.query.password){
                                req.query.password = req.session.passwordContest
                            }
                            if(ContestProblem.password != req.query.password && isPassword){
                                res.redirect('/contest?status=2')
                            }
                            else if(ContestProblem.ListBanned.includes(user.username)){
                                res.redirect('/contest?status=0')
                            }
                            else{
                                if(!req.session.passwordContest && isPassword){
                                    req.session.passwordContest = ContestProblem.password
                                    res.redirect('/contest/' + req.params._id)
                                }
                                else{
                                    ContestProblem.AmountProblem = Object.keys(ContestProblem.problems).length
                                    if(!ContestProblem.participants.find(item => item.username === user.username)){
                                        const NewAttendee = {
                                            username: user.username,
                                            _id: req.session._id,
                                            listScore: Array.from({ length: ContestProblem.AmountProblem }, (_, i) => 'Đang chấm')
                                        }
                                        ContestProblem.participants.push(NewAttendee);
                                        ContestProblem.AmountAttendee++;
                                        ContestProblem.markModified('participants');
                                        ContestProblem.markModified('AmountAttendee');
                                        ContestProblem.save()
                                            .then()
                                            .catch()
                                    }
                                    ContestProblem = ContestProblem.toJSON();
                                    let listSolved = []
                                    for (let i = 0; i < ContestProblem.ListSolutions.length; i++) {
                                        listSolved[i] = 0
                                        if (ContestProblem.ListSolutions[i]) {
                                            for (let j = 0; j < ContestProblem.ListSolutions[i].length; j++) {
                                                if (ContestProblem.ListSolutions[i][j].au == user.username) {
                                                    listSolved[i] = 1
                                                    break
                                                }
                                            }
                                        }
                                    }
                
                                    let Statistic = []
                                    for (let i = 0; i < Object.keys(ContestProblem.problems).length; i++) {
                                        (ContestProblem.ListSolutions[i]) ? Statistic[i] = ContestProblem.ListSolutions[i].length : Statistic[i] = 0
                                    }
                
                                    let ListProblem = []
                                    for (let i = 0; i < Statistic.length; i++) {
                                        ListProblem.push(`Bài ${i + 1}`)
                                    }
                                    
                                    ContestProblem.AmountProblem = Object.keys(ContestProblem.problems).length
                                    ContestProblem.AmountAttendee = Object.keys(ContestProblem.participants).length
                                    res.render('contest/Currentcontest', {user, ContestProblem, listSolved, Statistic, ListProblem, activePage})
                                }
                            }
                        }
                        if (ContestProblem.status == '0') {
                            listUser.find()
                                .then(listUser => {
                                    ContestProblem = ContestProblem.toJSON();
                                    const idContest = req.params._id;
            
                                    for (let participant of ContestProblem.participants) {
                                        for(let user of listUser){
                                            if(user.username == participant.username){
                                                participant.idALC = user._id
                                                participant.color = user.color
                                                participant.fontWeight = user.fontWeight
                                                // participant.role = user.role
                                                break
                                            }
                                        }
                                    }
            
                                    for(let user of ContestProblem.participants){
                                        let numOr0 = n => isNaN(n) ? 0 : Number(n);
                                        user.totalScore = user.listScore.reduce((a, b) => numOr0(a) + numOr0(b));
                                    }
                                    ContestProblem.participants.sort(function(a, b) {
                                        return b.totalScore - a.totalScore;
                                    })
                                    res.render('contest/Oldcontest', {user, ContestProblem, idContest, activePage})
                                })
                                .catch()
                        }
                    })
                    .catch(next)
            }
            else{
                res.redirect('/contest?status=1')
            }
        }
    }

    submit(req, res, next) {
        console.log(req.body)
        console.log(JSON.parse(req.body.solution))
        ContestProblem.findById(req.params._id)
            .then(ContestProblem => {
                let Solution
                if(req.files){
                    Solution = {
                        au: req.session.username,
                        date: Date(),
                        imageA: (req.files[0]) ? req.files[0].filename : "",
                        imageB: (req.files[1]) ? req.files[1].filename : "",
                        imageC: (req.files[2]) ? req.files[2].filename : "",
                        sequence: JSON.parse(req.body.solution).Sequence
                    }
                }
                else{
                    Solution = {
                        au: req.session.username,
                        date: Date(),
                        sequence: JSON.parse(req.body.solution).Sequence

                    }
                }
                if (ContestProblem.ListSolutions[req.body.Index]) {
                    ContestProblem.ListSolutions[req.body.Index].push(Solution)
                }
                else {
                    ContestProblem.ListSolutions[req.body.Index] = [Solution]
                }

                if(Solution.au){
                    ContestProblem.markModified('ListSolutions');
                    ContestProblem.save()
                        .then(() => {
                            res.redirect('/contest/' + req.params._id)
                        })
                        .catch()
                }
                else{
                    res.redirect('/contest/' + req.params._id)
                }


            })
    }

    showSolution(req, res, next){
        const user = req.session
        const index = req.params.index
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            if(user.username){
                ContestProblem.findById(req.params._id)
                    .then(ContestProblem =>{
                        listUser.find()
                            .then(listUser =>{
                                ContestProblem = ContestProblem.toJSON();
                                let ListSolutions = ContestProblem.ListSolutions[index]
                                const Problem = ContestProblem.problems[index]
                                var isEmptySol
                                if(ListSolutions){
                                    isEmptySol = false
                                    for (let participant of ListSolutions) {
                                        for(let user of listUser){
                                            if(user.username == participant.au){
                                                participant.idALC = user._id
                                                participant.avatar = user.avatar
                                                participant.color = user.color
                                                participant.fontWeight = user.fontWeight
                                                // participant.role = user.role
                                                break
                                            }
                                        }
                                    }
                                }
                                else{
                                    isEmptySol = true
                                }
                                
                                res.render('contest/contest_solution', {user, ListSolutions, Problem, index, activePage, isEmptySol})
                            })
                            .catch()
                    })
                    .catch()
            }
            else{
                res.redirect('/')
            }
        }
    }

}

module.exports = new Contest;
