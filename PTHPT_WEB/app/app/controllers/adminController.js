const Announcement = require('../models/Announcement');
const User = require('../models/register');
const topListAssignment = require('../models/topListAssignment');
const assignment = require('../models/assignment');
const coreteam = require('../models/coreteam');
const contest = require('../models/contest');
const updatePosition = require('../util/updatePosition');

class adminController {
    index(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            User.findOne({ username: user.username })
                .then(User => {
                    const userRole = User.toJSON()
                    if (user.role == "admin" || user.role == "member") {
                        res.render('admin/admin', { user, userRole })
                    }
                    else {
                        res.redirect('/')
                    }
                })
        }
        else {
            res.redirect('/')
        }
    }
    // [GET] /admin/:id/edit
    editMember(req, res, next) {
        User.findById(req.params.id)
            .then(repairuser => {

                repairuser = repairuser.toJSON();

                res.render('admin/edit', { repairuser, user: req.session.username })
            })
            .catch(next)
    }
    // [PUT] /admin/:id
    update(req, res, next) {
        //res.json(req.body)
        User.updateOne({ _id: req.params.id }, req.body)   // Đối số thứ 2 : value update cho đối số thứ 1
            .then(() => {
                console.log(req.body);
                res.redirect('/admin')
            })
            .catch(next)
    }
    // [GET] /admin/:id/delete
    destroy(req, res, next) {
        User.findById(req.params.id)
            .then(deleteuser => {

                deleteuser = deleteuser.toJSON();

                res.render('admin/delete', { deleteuser, user: req.session.username })
            })
            .catch(next)
    }
    // [POST] /admin/:id
    delete(req, res, next) {
        User.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('/admin')
            })
            .catch(next)
    }
    createPosts(req, res, next) {
        Announcement.create({ description: req.body.description, title: req.body.title, likes: 0 })
            .then(() => {
                console.log("Create success");
                res.redirect('/admin')
            })
            .catch(next)
    }
    createExercise(req, res, next) {
        Post.create({
            title: req.body.title, score: req.body.score,
            author: req.body.author, description: req.body.description, views: 0
        })
            .then(() => {
                console.log("Create exercise success");
                res.redirect('/admin')
            })
            .catch(next)
    }

    /////////////////////

    Announcement(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            Announcement.find()
                .then(Announcement => {
                    Announcement = Announcement.map(Announcement => Announcement.toJSON());
                    Announcement.reverse()
                    res.render('admin/announcement', { Announcement, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    AnnouncementDetail(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            Announcement.findById(req.params._id)
                .then(Announcement => {
                    Announcement = Announcement.toJSON()
                    res.render('admin/announcementDetail', { Announcement, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    AnnouncementUpdate(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            Announcement.updateOne({ _id: req.params._id }, req.body)
                .then(() => {
                    res.redirect('/admin/announcement')
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    AnnouncementCreate(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            res.render('admin/announcementCreate', { user })
        }
        else {
            res.redirect('/')
        }
    }

    AnnouncementCreateForm(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            var dateString = day + '/' + month + '/' + year;
            Announcement.create({ title: req.body.title, description: req.body.description, date: dateString })
                .then(() => {
                    res.redirect('/admin/announcement')
                })
                .catch(next)
        }
        else {
            res.redirect('/')
        }
    }

    Member(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            User.find()
                .then(User => {
                    User = User.map(User => User.toJSON());
                    for(let user of User){
                        user.AmountGolden = user.goldenMedal.length
                        user.AmountSilver = user.silverMedal.length
                        user.AmountBronze = user.bronzeMedal.length
                    }
                    res.render('admin/member', { User, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    MemberDetail(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            User.findById(req.params._id)
                .then(User => {
                    User = User.toJSON()
                    res.render('admin/memberDetail', { User, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    MemberUpdate(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            User.updateOne({ _id: req.params._id }, req.body)
                .then(() => {
                    res.redirect('/admin/member')
                })
                .catch()

        }
        else {
            res.redirect('/')
        }
    }

    topListAssignment(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {
            topListAssignment.find()
                .then(topListAssignment => {
                    topListAssignment = topListAssignment.map(topListAssignment => topListAssignment.toJSON());
                    res.render('admin/topListAssignment', { topListAssignment, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    typeAssignment(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            assignment.find({ type: req.params.Type })
                .then(assignment => {
                    assignment = assignment.map(assignment => assignment.toJSON());
                    res.render('admin/assignment', { assignment, user })
                })
                .catch()

        }
        else {
            res.redirect('/')
        }
    }

    topListAssignmentUpdate(req, res, next) {
        topListAssignment.findById(req.params._id)
            .then(topListAssignment => {
                topListAssignment = topListAssignment.toJSON()
                res.render('admin/topListAssignmentUpdate', { topListAssignment })
            })
            .catch()
    }

    topListAssignmentUpdateType(req, res, next) {
        topListAssignment.updateOne({ _id: req.params._id }, req.body)
            .then(() => {
                res.redirect('/admin/topListAssignment')
            })
            .catch()
    }

    topListAssignmentCreate(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            res.render('admin/topListAssignmentCreate')

        }
        else {
            res.redirect('/')
        }
    }

    topListAssignmentCreateType(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            topListAssignment.create({ nameType: req.body.nameType, Type: req.body.Type })
                .then(() => {
                    res.redirect('/admin/topListAssignment')
                })
                .catch(next)

        }
        else {
            res.redirect('/')
        }
    }

    typeAssignmentDetail(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            assignment.findById(req.params._id)
                .then(assignment => {
                    assignment = assignment.toJSON()
                    res.render('admin/assignmentDetail', { assignment, user })
                })
                .catch()

        }
        else {
            res.redirect('/')
        }
    }

    typeAssignmentCreate(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            const Type = res.params
            res.render('admin/assignmentCreate', { Type, user })

        }
        else {
            res.redirect('/')
        }
    }

    typeAssignmentCreateForm(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            var dateString = day + '/' + month + '/' + year;
            assignment.create({ title: req.body.title, type: req.body.type, content: req.body.content, image: req.body.image, resource: req.body.resource, score: req.body.score, author: user.username, date: dateString })
                .then(() => {
                    res.redirect('/admin/topListAssignment/' + req.body.type + '/assignment')
                })
                .catch()

        }
        else {
            res.redirect('/')
        }
    }

    typeAssignmentUpdate(req, res, next) {
        const user = req.session
        if (user.role == "admin" || user.role == "member") {

            assignment.updateOne({ _id: req.params._id }, req.body)
                .then(() => {
                    res.redirect('/admin/topListAssignment/' + req.body.type + '/assignment')
                })
                .catch()

        }
        else {
            res.redirect('/')
        }
    }

    coreteam(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            coreteam.find()
                .then(coreteam => {
                    coreteam = coreteam.map(coreteam => coreteam.toJSON())
                    res.render('admin/coreteam', { coreteam, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    coreteamCreate(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            res.render('admin/coreteamCreate', { user })
        }
        else {
            res.redirect('/')
        }
    }

    coreteamCreatePost(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            coreteam.create({ name: req.body.name, mail: req.body.mail, role: req.body.role, location: req.body.location, imageFrist: req.body.imageFrist, imageSecond: req.body.imageSecond, idUser: req.body.idUser })
                .then(() => {
                    res.redirect('/admin/coreteam')
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    coreteamDetail(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            coreteam.findById(req.params._id)
                .then(coreteam => {
                    coreteam = coreteam.toJSON()
                    res.render('admin/coreteamDetail', { coreteam, user })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    coreteamUpdate(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            coreteam.updateOne({ _id: req.params._id }, req.body)
                .then(() => {
                    res.redirect('/admin/coreteam')
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    coreteamDelete(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            coreteam.deleteOne({ _id: req.params._id })
                .then(() => {
                    res.redirect('/admin/coreteam')
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contest(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            contest.find()
                .then(contest => {
                    contest = contest.map(contest => contest.toJSON())
                    contest = contest.reverse()
                    res.render('admin/contest', { user, contest })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contestDetail(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            contest.findById(req.params._id)
                .then(contest => {
                    contest = contest.toJSON()
                    res.render('admin/contestDetail', { user, contest })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contestDetailUpdateProblems(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            contest.findById(req.params._id)
                .then(contest => {
                    contest.status = req.body.status
                    contest.name = req.body.name
                    contest.duration = req.body.duration
                    contest.timeStart = req.body.timeStart
                    contest.timeTotal = req.body.timeTotal
                    contest.password = req.body.password
                    var problems = []
                    for (let i = 0; i < req.body.context.length; i++) {
                        problems.push({
                            context: req.body.context[i],
                            problem: req.body.problem[i],
                            score: req.body.score[i],
                        })
                    }
                    contest.problems = problems
                    contest.save()
                        .then(() => {
                            res.redirect('/admin/contest')
                        })
                        .catch()
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contestParticipant(req, res, next) {
        const user = req.session
        if (user.role == 'admin' || user.role == 'member') {
            contest.findById(req.params._id)
                .then(contest => {
                    contest = contest.toJSON()
                    var listUsername = {}
                    for (let username of contest.participants) {
                        listUsername[username.username] = 0
                    }
                    for (let problem of contest.ListSolutions) {
                        for (let submission of problem) {
                            listUsername[submission.au] += 1
                        }
                    }
                    for (let username of contest.participants) {
                        username.submission = listUsername[username.username]
                        username.banned = (contest.ListBanned.includes(username.username)) ? 1 : 0
                    }
                    res.render('admin/contestParticipants', { user, contest })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contestParticipantDetail(req, res, next) {
        const user = req.session
        if (user.role == 'admin' || user.role == 'member') {
            contest.findById(req.params._id)
                .then(contest => {
                    contest = contest.toJSON()
                    var inforUserContest = {}
                    inforUserContest.username = req.params.username
                    for (let participant of contest.participants) {
                        if (participant.username == req.params.username) {
                            inforUserContest.listScore = participant.listScore
                            break
                        }
                    }

                    inforUserContest.listSubmission = []
                    for (let i = 0; i < contest.ListSolutions.length; i++) {
                        for (let submission of contest.ListSolutions[i]) {
                            if (submission.au == req.params.username) {
                                inforUserContest.listSubmission.push({
                                    key: i,
                                    imageA: submission.imageA,
                                    imageB: submission.imageB,
                                    imageC: submission.imageC,
                                    comment: submission.comment
                                })
                            }
                        }
                    }
                    res.render('admin/contestParticipantDetail', { user, inforUserContest })
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contestUpdateParticipant(req, res, next) {
        const user = req.session
        if (user.role == 'admin' || user.role == 'member') {
            contest.findById(req.params._id)
                .then(contest => {
                    for (let i = 0; i < contest.ListSolutions.length; i++) {
                        if (req.body.hasOwnProperty(i.toString() + 'imageA')) {
                            for (let submission of contest.ListSolutions[i]) {
                                if (submission.au == req.params.username) {
                                    submission.imageA = req.body[i.toString() + 'imageA']
                                }
                            }
                        }
                        if (req.body.hasOwnProperty(i.toString() + 'imageB')) {
                            for (let submission of contest.ListSolutions[i]) {
                                if (submission.au == req.params.username) {
                                    submission.imageB = req.body[i.toString() + 'imageB']
                                }
                            }
                        }
                        if (req.body.hasOwnProperty(i.toString() + 'imageC')) {
                            for (let submission of contest.ListSolutions[i]) {
                                if (submission.au == req.params.username) {
                                    submission.imageC = req.body[i.toString() + 'imageC']
                                }
                            }
                        }
                        if (req.body.hasOwnProperty(i.toString() + 'comment')) {
                            for (let submission of contest.ListSolutions[i]) {
                                if (submission.au == req.params.username) {
                                    submission.comment = req.body[i.toString() + 'comment']
                                }
                            }
                        }
                    }
                    for (let participant of contest.participants) {
                        if (participant.username == req.params.username) {
                            participant.listScore = req.body.listScore
                        }
                    }
                    var tempArray = contest.toJSON()
                    contest.ListSolutions = tempArray.ListSolutions
                    contest.markModified('participants')
                    contest.markModified('ListSolutions')
                    contest.save()
                        .then(() => {
                            res.redirect('/admin/contest/' + req.params._id + '/participants')
                        })
                        .catch()
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

    contestCreate(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            res.render('admin/contestCreate', { user })
        }
        else {
            res.redirect('/')
        }
    }

    contestCreateContest(req, res, next) {
        const user = req.session
        if (user.role == 'admin') {
            contest.findOne({ status: 1 })
                .then(Currentcontest => {
                    if (Currentcontest) {
                        res.redirect('/admin/contest')
                    }
                    else {
                        var problems = []
                        var ListSolutions = []
                        for (let i = 0; i < req.body.problems.length; i++) {
                            if (req.body.problems[i]) {
                                problems.push({
                                    context: req.body.context[i],
                                    problem: req.body.problems[i],
                                    score: req.body.score[i],
                                })
                                ListSolutions.push([])
                            }
                        }
                        contest.create({
                            name: req.body.name,
                            timeTotal: req.body.timeTotal,
                            duration: req.body.timeTotal,
                            date: req.body.date,
                            timeStart: req.body.timeStart,
                            problems: problems,
                            status: 2,
                            password: req.body.password
                        })
                            .then(() => {
                                res.redirect('/admin/contest')
                            })
                            .catch()
                    }
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }
    
    contestParticipantBan(req, res, next){
        const user = req.session
        if (user.role == 'admin') {
            contest.findById(req.params._id)
                .then(contest =>{
                    if(contest.ListBanned.includes(req.params.username)){
                        contest.ListBanned = contest.ListBanned.filter(username => username != req.params.username)
                    }
                    else{
                        contest.ListBanned.push(req.params.username)
                    }
                    contest.markModified('ListBanned')
                    contest.save()
                        .then(()=>{
                            res.redirect('/admin/contest/' + req.params._id + '/participants')
                        })
                        .catch()
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }
    
    contestUpdateScore(req, res, next){
        const user = req.session
        if (user.role == 'admin') {
            contest.findById(req.params._id)
                .then(contest => {
                    contest = contest.toJSON()
                    let checkFlag = true
                    for(let person of contest.participants){
                        for(let score of person.listScore){
                            if(score == 'Đang chấm'){
                                checkFlag = false
                            }
                        }
                    }
                    if(checkFlag){
                        User.find()
                            .then(listUser => {
                                var listTopScore = contest.participants
                                for(let item of listTopScore){
                                    item.total = item.listScore.reduce((a, b) => Number(a) + Number(b))
                                }
                                listTopScore.sort((a, b) => {
                                    return b.total - a.total;
                                });
                                //console.log(listTopScore)
                                for(let user of listUser){
                                    if(user.username == listTopScore[0].username){
                                        user.goldenMedal.push(req.params._id)
                                        user.score += 300
                                    }
                                    if(user.username == listTopScore[1].username){
                                        user.silverMedal.push(req.params._id)
                                        user.score += 200
                                    }
                                    if(user.username == listTopScore[2].username){
                                        user.bronzeMedal.push(req.params._id)
                                        user.score += 100
                                    }
                                }
                                for(let user of listUser){
                                    for(let participant of listTopScore){
                                        if(user.username == participant.username){
                                            //console.log(user.username, user.score, participant.total)
                                            user.score += 1 * participant.total
                                            user.score += 50
                                            //console.log(user.username, user.score)
                                            let updateFeature = updatePosition(user.score)
                                            user.color = updateFeature[0]
                                            user.position = updateFeature[1]
                                            user.fontWeight = updateFeature[2]
                                            user.contest += 1
                                        }
                                    }
                                }
                                for(let user of listUser){
                                    user.save()
                                        .then()
                                        .catch()
                                }
                                res.redirect('/admin/contest/' + req.params._id + '/detail')
                                
                            })
                            .catch()
                    }
                    else{
                        res.redirect('/admin/contest/' + req.params._id + '/detail')
                    }
                })
                .catch()
        }
        else {
            res.redirect('/')
        }
    }

}


module.exports = new adminController;