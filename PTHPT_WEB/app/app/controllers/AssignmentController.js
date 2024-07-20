const assignment = require('../models/assignment');
const topListAssignment = require('../models/topListAssignment');
const listUser = require('../models/register');
const submission = require('../models/submission');
const seedrandom = require('seedrandom');
const activePage = 1
const assignmentAmount = 50

function objectId() {
    return hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}
function hex(value) {
    return Math.floor(value).toString(16)
}
function tronMang(arr) {
    const seed = new Date()
    const rng = seedrandom(`${seed.getDate()}-${seed.getMonth()}`);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
class Assignment {

    // [GET] /
    index(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            assignment.find()
                .then(assignment => {
                    topListAssignment.find()
                        .then(topListAssignment => {
                            assignment = assignment.map(assignment => assignment.toJSON());
                            let assignmentTemp = [...assignment.map(obj => ({ ...obj }))];
                            assignment = tronMang(assignment)
    
                            for (let item of assignment) {
                                item.isSolved = 0
                                if (user.username) {
                                    for (let sol of item.solutions) {
                                        item.isSolved = (sol.author == user.username) ? 1 : 0
                                    }
                                }
                                item.sols = 0
                                for(let sol of item.solutions){
                                    if(sol.deleted == 0) item.sols += 1
                                }
                            }
    
                            topListAssignment = topListAssignment.map(topListAssignment => topListAssignment.toJSON());
                            var arrActive = []
                            for (let i = 0; i < topListAssignment.length; i++) {
                                (i == 0) ? arrActive.push(1) : arrActive.push(0)
                            }
    
                            // Khởi tạo giá trị min và max
                            var minScore = Number.MAX_VALUE;
                            var maxScore = Number.MIN_VALUE;
    
                            // Duyệt qua mảng để tìm giá trị min và max
                            for (var i = 0; i < assignment.length; i++) {
                                var score = assignment[i].score;
    
                                // Tìm giá trị min
                                if (score < minScore) {
                                    minScore = score;
                                }
    
                                // Tìm giá trị max
                                if (score > maxScore) {
                                    maxScore = score;
                                }
                            }
    
                            // Nếu có type
                            if (req.query.type) {
                                // Lọc các bài toán theo loại
                                const Type = req.query.type
                                assignment = assignment.filter(function (obj) {
                                    return obj["type"] === Type;
                                });
    
                                // Cập lập danh sách active
                                for (let i = 0; i < topListAssignment.length; i++) {
                                    (topListAssignment[i].Type == Type) ? arrActive[i] = 1 : arrActive[i] = 0
                                }
                                //res.render('assignment/assignment', { assignment, user, topListAssignment, arrActive })
                            }
    
                            if (req.query.hideSolved) {
                                assignment = assignment.filter(function (item) {
                                    return item.isSolved == 0
                                })
                            }
    
                            if (req.query.option == "hardestFrist") {
                                assignment.sort(function (a, b) {
                                    return b.score - a.score;
                                });
                            }
    
                            if (req.query.option == "easyestFrist") {
                                assignment.sort(function (a, b) {
                                    return a.score - b.score;
                                });
                            }
    
                            if (req.query.option == "popularFrist") {
                                assignment.sort(function (a, b) {
                                    return b.view - a.view;
                                });
                            }
    
                            if (req.query.option == "lastestFrist") {
                                assignment = assignmentTemp.reverse();
                            }
    
                            if (req.query.minPoint) {
                                assignment = assignment.filter(function (obj) {
                                    return obj.score >= req.query.minPoint;
                                });
                            }
    
                            if (req.query.maxPoint) {
                                assignment = assignment.filter(function (obj) {
                                    return obj.score <= req.query.maxPoint;
                                });
                            }
    
                            let page = req.params.page
                            const totalAssignment = assignment.length;
    
                            page = (typeof page == 'undefined') ? 0 : Number(page);
                            if (Number.isInteger(page)) {
                                const pagination = totalAssignment / assignmentAmount
                                if (page > pagination) {
                                    res.redirect("/assignment")
                                }
                                else {
                                    assignment = assignment.slice(page * assignmentAmount, (page + 1) * assignmentAmount)
                                    let paginationLoop = Array.from({ length: pagination + 1 }, (_, index) => index + 1);
                                    res.render('assignment/assignment', { page: page + 1, paginationLoop, assignment, user, topListAssignment, arrActive, minScore, maxScore, activePage })
                                }
                            }
                            else {
                                res.redirect("/assignment")
                            }
    
                        })
                        .catch(next)
                })
                .catch(next)
        }

    }

    view(req, res, next) {
        const user = req.session
        const role = req.session.role
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            assignment.findById(req.params._id)
                .then(assignment => {
                    assignment.view += 1
                    assignment.markModified("view");
                    assignment.save()
                        .then()
                        .catch()
                    assignment = assignment.toJSON()
                    let isSolved = 0
                    if (user.username) {
                        for (let sol of assignment.solutions) {
                            isSolved = (sol.author == user.username) ? 1 : 0
                        }
                    }
                    for (let i = 0; i < assignment.comment.length; i++) {
                        if (!assignment.comment[i].deleted) {
                            assignment.comment[i].isLike = (assignment.comment[i].liked.includes(user.username)) ? 1 : 0
    
                            for (let j = 0; j < assignment.comment[i].commentChild.length; j++) {
                                if (!assignment.comment[i].commentChild[j].deleted) {
                                    assignment.comment[i].commentChild[j].isLike = (assignment.comment[i].commentChild[j].liked.includes(user.username)) ? 1 : 0
    
                                }
                            }
                        }
                    }
    
                    var listOfNames = []
                    for (let comment of assignment.comment) {
                        listOfNames.includes(comment.au) ? 1 : listOfNames.push(comment.au);
                        for (let commentChild of comment.commentChild) {
                            listOfNames.includes(commentChild.au) ? 1 : listOfNames.push(commentChild.au);
                        }
                    }
    
                    listUser.find()
                        .then(listUser => {
                            listUser = listUser.map(listUser => listUser.toJSON())
                            var filteredUsers = listUser.filter(function (user) {
                                return listOfNames.includes(user.username);
                            });
    
                            for (let comment of assignment.comment) {
                                let inforUser = filteredUsers.filter(user => user.username == comment.au)
                                comment.avatar = inforUser[0].avatar
                                comment.idAuthor = inforUser[0]._id
                                comment.color = inforUser[0].color
                                comment.position = inforUser[0].position
                                comment.score = inforUser[0].score
                                comment.role = inforUser[0].role
                                comment.fontWeight = inforUser[0].fontWeight
                                for (let commentChild of comment.commentChild) {
                                    let inforUser = filteredUsers.filter(user => user.username == commentChild.au)
                                    commentChild.avatar = inforUser[0].avatar
                                    commentChild.idAuthor = inforUser[0]._id
                                    commentChild.color = inforUser[0].color
                                    commentChild.position = inforUser[0].position
                                    commentChild.score = inforUser[0].score
                                    commentChild.role = inforUser[0].role
                                    commentChild.fontWeight = inforUser[0].fontWeight
                                }
                            }
    
                            res.render('assignment/assignment_view', { assignment, user, isSolved, role, activePage })
                        })
                        .catch()
    
    
                })
                .catch(next)
        }
    }

    submit(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            if(user.username){
                assignment.findById(req.params._id)
                    .then(assignment => {
                        var currentDate = new Date();
                        var day = currentDate.getDate();
                        var month = currentDate.getMonth() + 1;
                        var year = currentDate.getFullYear();
                        var dateString = day + '/' + month + '/' + year;
                        var vietnamTime = new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Ho_Chi_Minh',
                            timeStyle: 'medium',
                            hour12: false,
                        });
                        var formDate = {};
                        formDate.author = req.session.username;
                        formDate.deleted = 0
                        formDate.deleteAt = ""
                        formDate.views = 0
                        formDate.whoViews = []
                        formDate.likes = 0
                        formDate.liked = []
                        formDate.descriptionA = req.body.descriptionA;
                        formDate.descriptionB = req.body.descriptionB;
                        formDate.key = req.params._id;
                        formDate.author = user.username;
                        (req.files[0]) ? formDate.imageA = req.files[0].filename : formDate.imageA = "";
                        (req.files[1]) ? formDate.imageB = req.files[1].filename : formDate.imageB = "";
                        (req.files[2]) ? formDate.imageC = req.files[2].filename : formDate.imageC = "";
                        formDate.date = dateString
                        formDate.time = currentDate
                        formDate._id = objectId()
                        assignment.solutions.push(formDate)
                        assignment.markModified("solution")
                        assignment.save()
                            .then(() => {
                                listUser.findOne({ username: user.username })
                                    .then(User => {
                                        console.log('username: ', user.username, '_id: ', req.params._id)
                                        if (!User.historySubmit.includes(req.params._id)) {
                                            User.historySubmit.push(req.params._id)
                                            User.assignment += 1
                                        }
                                        User.markModified("historySubmit")
                                        User.markModified("assignment")
                                        User.save()
                                            .then(() => {
                                                submission.create({ applicant: user.username, image: assignment.image, score: assignment.score, date: vietnamTime.format(currentDate), key: assignment._id, title: assignment.title, time: dateString })
                                                    .then(() => {
                                                        res.redirect('/assignment/solution/' + req.params._id);
                                                    })
                                                    .catch()
                                            })
                                            .catch()
                                    })
                                    .catch()
                            })
                            .catch(next)
        
                    })
                    .catch()
            }
            else{
                res.json({error: "Nộp bài không thành công do chưa đăng nhập, nếu đã đăng nhập nhưng vẫn bị lỗi xin vui lòng liên hệ với quản trị viên"})
            }
        }

    }

    showSolution(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            assignment.findById(req.params._id)
                .then(assignment => {
                    assignment = assignment.toJSON()
                    let isNull = 1
                    for (let sol of assignment.solutions) {
                        if (!sol.delete) {
                            isNull = 0
                            sol.isLike = (sol.liked.includes(user.username)) ? 1 : 0
                        }
                    }
    
                    var listOfNames = []
                    for (let solution of assignment.solutions) {
                        listOfNames.includes(solution.author) && solution.author ? 1 : listOfNames.push(solution.author);
                    }
    
                    listUser.find()
                        .then(listUser => {
                            listUser = listUser.map(listUser => listUser.toJSON())
                            var filteredUsers = listUser.filter(function (user) {
                                return listOfNames.includes(user.username);
                            });

                            console.log('filteredUsers', filteredUsers)
    
                            for (let solution of assignment.solutions) {
                                let inforUser = filteredUsers.filter(user => user.username == solution.author)
                                console.log('Error: assignment/assignment_show, _id:', req.params._id)
                                console.log('solution: ', solution)
                                console.log('inforUser', inforUser)
                                if(inforUser[0]){
                                    solution.avatar = inforUser[0].avatar
                                    solution.idAuthor = inforUser[0]._id
                                    solution.color = inforUser[0].color
                                    solution.position = inforUser[0].position
                                    solution.score = inforUser[0].score
                                    solution.role = inforUser[0].role
                                    solution.fontWeight = inforUser[0].fontWeight
                                }
                            }
    
                            res.render('assignment/assignment_show', { assignment, user, isNull, activePage })                    })
                        .catch()
    
                    
                })
                .catch()
        }
    }


}

module.exports = new Assignment;
