const ContestProblem = require('../models/contest');
const Announcement = require('../models/Announcement');
const Assignment = require('../models/assignment');
const assignment = require('../models/assignment');
const User = require('../models/register');
const updatePosition = require('../util/updatePosition');
const solution = require('../models/solution');


listUserThread = []
function objectId() {
    return hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}
function hex(value) {
    return Math.floor(value).toString(16)
}

async function countdown(ContestProblem, socket) {
    const updateInterval = 1000;
    const Stringtime = ContestProblem.timeTotal;
    let [H, M, S] = Stringtime.split(":").map(Number);
    const TotalTime = S + M * 60 + H * 60 * 60;

    async function updateDuration() {
        const time = ContestProblem.duration;
        let [hour, minute, second] = time.split(":").map(Number);
        second--;

        if (hour === 0 && minute === 0 && second === 0) {

            setTimeout(() => {
                _io.emit("updateContestReload", true)
            }, 1000)

            for (let obj of listUserThread) {
                clearInterval(obj)
            }
            ContestProblem.status = 0;
            ContestProblem.markModified('status');

            try {
                await ContestProblem.save();
            } catch (error) {
                console.error('Error saving to MongoDB:', error);
            }
        }

        if (minute === 0 && second === -1) {
            second = 59;
            minute = 59;
            hour--;
        }

        if (second === -1) {
            second = 59;
            minute--;
        }

        const formattedSecond = second < 10 ? "0" + second : second;
        const formattedMinute = minute < 10 ? "0" + minute : minute;
        const formattedHour = hour < 10 ? "0" + hour : hour;

        const duration = `${formattedHour}:${formattedMinute}:${formattedSecond}`;

        ContestProblem.duration = duration;
        ContestProblem.markModified('duration');

        ContestProblem.PercentTime = (ContestProblem.CurrentTime / TotalTime) * 100 + "%";
        ContestProblem.markModified('PercentTime');

        ContestProblem.markModified('CurrentTime');

        try {
            await ContestProblem.save();
            _io.emit("time", ContestProblem.duration, ContestProblem.PercentTime)
        } catch (error) {
            console.error('Error saving to MongoDB:', error)
        }
    }

    async function startCountdown() {
        if(listUserThread.length == 0){
            intervalID = setInterval(async () => {
                ContestProblem.CurrentTime++;
                await updateDuration(intervalID);
            }, updateInterval);
            listUserThread.push(intervalID)
        }
    }
    await startCountdown();
}

class SocketService {
    connection(socket) {
        socket.on('disconnect', () => {
            console.log("Bye")

        })

        socket.on('connection', () => {
            

            ContestProblem.findOne({ status: 1 })
                .then(ContestProblem => {
                    if (ContestProblem) {
                        countdown(ContestProblem, socket)
                    }
                    else {

                    }
                })
                .catch()
        })

        socket.on('username', name => {
            console.log(name)
        })

        socket.on('reactNews', (user, index) => {
            console.log("index", index)
            if (user) {
                Announcement.find()
                    .then(Announcement => {
                        let temp = index + 1
                        const Temp = index
                        for (let i = 0; i < Announcement.length; i++) {
                            if (Announcement[i].deleted == 0) {
                                temp -= 1
                            }
                            if (temp == 0) {
                                index = i
                                break
                            }
                        }
                        console.log(index)

                        if (!Announcement[index].likes.includes(user)) {
                            Announcement[index].likes.push(user)
                            Announcement[index].numberReact += 1
                            Announcement[index].markModified('numberReact');
                            Announcement[index].markModified('likes');
                            Announcement[index].save()
                                .then(() => {
                                    socket.emit("ppp", 1, Temp, "")
                                })
                                .catch()
                        }
                        else {
                            Announcement[index].likes = Announcement[index].likes.filter(item => item !== user);
                            Announcement[index].numberReact -= 1
                            Announcement[index].markModified('numberReact');
                            Announcement[index].markModified('likes');
                            Announcement[index].save()
                                .then(() => {
                                    socket.emit("ppp", 0, Temp, "")
                                })
                                .catch()
                        }
                    })
                    .catch()
            }
            else {
                socket.emit("ppp", -1, index, "Bạn cần đăng nhập để thích bài viết này")
            }
        })

        socket.on('chat message', msg => {
            console.log(`${msg}`)
            _io.emit('chat message', msg)
        })

        socket.on("commentAnnouncement", (cmt, au, id, cmt_id) => {
            if (!cmt) {
                socket.emit("ppp", -1, 0, "Nội dung bình luận không được để trống")
            }
            if (!au) {
                socket.emit("ppp", -1, 0, "Bạn cần đăng nhập để thêm bình luận")
            }
            if (cmt && au) {
                if (cmt_id) {
                    Announcement.findById(id)
                        .then(Announcement => {
                            var currentDate = new Date();
                            var day = currentDate.getDate();
                            var month = currentDate.getMonth() + 1;
                            var year = currentDate.getFullYear();
                            var dateString = day + '/' + month + '/' + year;
                            const NewComment = {
                                au: au,
                                cmt: cmt,
                                deleted: 0,
                                deleteAt: "",
                                time: currentDate,
                                date: dateString,
                                cmt_id: objectId(),
                                likes: 0,
                                liked: []
                            }
                            for (let i = 0; i < Announcement.comment.length; i++) {
                                if (Announcement.comment[i].cmt_id == cmt_id) {
                                    Announcement.comment[i].commentChild.push(NewComment)
                                    if(Announcement.comment[i].au != au) {
                                        User.findOne({ username: Announcement.comment[i].au })
                                            .then(User => {
                                                let currentDate = new Date();
                                                let day = currentDate.getDate();
                                                let month = currentDate.getMonth() + 1;
                                                let year = currentDate.getFullYear();
                                                let formattedDate = `${day}/${month}/${year}`;
                                                User.announcement.push({
                                                    title: "Trả lời bình luận",
                                                    time: formattedDate,
                                                    icon: "comment",
                                                    destination: `/announcement/${id}`
                                                })
                                                _io.emit("UpdateIsNew", Announcement.comment[i].au)
                                                User.isNew = true
                                                User.save()
                                                    .then()
                                                    .catch()
                                            })
                                            .catch()
                                    }
                                    Announcement.markModified('comment');
                                    Announcement.save()
                                        .then(() => {
                                            console.log(cmt, au, cmt_id)
                                            socket.emit("commentSocket", cmt, au, dateString, cmt_id)
                                        })
                                        .catch()
                                }
                            }


                        })
                        .catch()
                }
                else {
                    Announcement.findById(id)
                        .then(Announcement => {
                            var currentDate = new Date();
                            var day = currentDate.getDate();
                            var month = currentDate.getMonth() + 1;
                            var year = currentDate.getFullYear();
                            var dateString = day + '/' + month + '/' + year;
                            const NewComment = {
                                au: au,
                                cmt: cmt,
                                deleted: 0,
                                deleteAt: "",
                                time: currentDate,
                                date: dateString,
                                cmt_id: objectId(),
                                likes: 0,
                                liked: [],
                                commentChild: []
                            }
                            Announcement.comment.push(NewComment)
                            Announcement.markModified('comment');
                            Announcement.save()
                                .then(() => {
                                    console.log(cmt, au, cmt_id)
                                    socket.emit("commentSocket", cmt, au, dateString, "TrungDzai")
                                })
                                .catch()

                        })
                        .catch()
                }
            }
        })

        socket.on('submit', Index => {
            ContestProblem.findOne({ status: 1 })
                .then(ContestProblem => {
                    if (ContestProblem) {
                        let Statistic = []
                        for (let i = 0; i < ContestProblem.problems.length; i++) {
                            (ContestProblem.ListSolutions[i]) ? Statistic[i] = ContestProblem.ListSolutions[i].length : Statistic[i] = 0
                        }
                        Statistic[Index]++
                        _io.emit('StatisticChart', Statistic)
                    }
                    else {

                    }
                })
                .catch()
        })

        socket.on("deleteCommentAnnouncement", (id, cmt_id) => {
            Announcement.findById(id)
                .then(Announcement => {
                    for (let i = 0; i < Announcement.comment.length; i++) {
                        if (Announcement.comment[i].cmt_id == cmt_id) {
                            Announcement.comment[i].deleted = 1
                            Announcement.comment[i].deleteAt = Date()
                            Announcement.markModified('comment');
                            Announcement.save()
                                .then(() => {
                                    socket.emit("ppp", 2, 0, "Bạn đã xóa bình luận thành công")
                                })
                                .catch()

                            return;

                        }
                        else {
                            for (let j = 0; j < Announcement.comment[i].commentChild.length; j++) {
                                if (Announcement.comment[i].commentChild[j].cmt_id == cmt_id) {
                                    Announcement.comment[i].commentChild[j].deleted = 1
                                    Announcement.comment[i].commentChild[j].deleteAt = Date()
                                    Announcement.markModified('comment');
                                    Announcement.save()
                                        .then(() => {
                                            socket.emit("ppp", 2, 0, "Bạn đã xóa bình luận thành công")
                                        })
                                        .catch()
                                    return;
                                }
                            }
                        }
                    }
                })
                .catch()
        })

        socket.on("reactComment", (user, id, cmt_id, index) => {
            console.log(user, id, cmt_id, index)
            if (user) {
                Announcement.findById(id)
                    .then(Announcement => {
                        for (let i = 0; i < Announcement.comment.length; i++) {
                            if (Announcement.comment[i].cmt_id == cmt_id) {
                                if (Announcement.comment[i].liked.includes(user)) {
                                    Announcement.comment[i].likes -= 1
                                    Announcement.comment[i].liked = Announcement.comment[i].liked.filter(element => element !== user);
                                    console.log("bb");
                                    socket.emit("resultReactComment", index, -1)
                                }
                                else {
                                    if(Announcement.comment[i].au != user) {
                                        User.findOne({ username: Announcement.comment[i].au })
                                            .then(User => {
                                                let currentDate = new Date();
                                                let day = currentDate.getDate();
                                                let month = currentDate.getMonth() + 1;
                                                let year = currentDate.getFullYear();
                                                let formattedDate = `${day}/${month}/${year}`;
                                                User.announcement.push({
                                                    title: "Lượt thích bình luận mới",
                                                    time: formattedDate,
                                                    icon: "heart",
                                                    destination: `/announcement/${id}`
                                                })
                                                _io.emit("UpdateIsNew", Announcement.comment[i].au)
                                                User.isNew = true
                                                User.save()
                                                    .then()
                                                    .catch()
                                            })
                                            .catch()

                                    }
                                    Announcement.comment[i].likes += 1
                                    Announcement.comment[i].liked.push(user)
                                    socket.emit("resultReactComment", index, 1)
                                }
                                Announcement.markModified('comment');
                                Announcement.save()
                                    .then()
                                    .catch()
                                return;
                            }
                            else {
                                for (let j = 0; j < Announcement.comment[i].commentChild.length; j++) {
                                    if (Announcement.comment[i].commentChild[j].cmt_id == cmt_id) {
                                        if (Announcement.comment[i].commentChild[j].liked.includes(user)) {
                                            Announcement.comment[i].commentChild[j].likes -= 1
                                            Announcement.comment[i].commentChild[j].liked = Announcement.comment[i].commentChild[j].liked.filter(element => element !== user);
                                            socket.emit("resultReactComment", index, -1)
                                        }
                                        else {
                                            Announcement.comment[i].commentChild[j].likes += 1
                                            Announcement.comment[i].commentChild[j].liked.push(user)
                                            if(Announcement.comment[i].commentChild[j].au != user){
                                                User.findOne({ username: Announcement.comment[i].commentChild[j].au })
                                                    .then(User => {
                                                        let currentDate = new Date();
                                                        let day = currentDate.getDate();
                                                        let month = currentDate.getMonth() + 1;
                                                        let year = currentDate.getFullYear();
                                                        let formattedDate = `${day}/${month}/${year}`;
                                                        User.announcement.push({
                                                            title: "Lượt thích bình luận mới",
                                                            time: formattedDate,
                                                            icon: "heart",
                                                            destination: `/announcement/${id}`
                                                        })
                                                        _io.emit("UpdateIsNew", Announcement.comment[i].commentChild[j].au)
                                                        User.isNew = true
                                                        User.save()
                                                            .then()
                                                            .catch()
                                                    })
                                                    .catch()
                                            }
                                            socket.emit("resultReactComment", index, 1)
                                        }
                                        Announcement.markModified('comment');
                                        Announcement.save()
                                            .then()
                                            .catch()
                                        return;
                                    }
                                }
                            }
                        }
                    })
                    .catch()
            }
            else {
                socket.emit("ppp", -1, index, "Bạn cần đăng nhập để thích bình luận này")
            }
        })

        socket.on("reactCommentAssignmentView", (user, id, cmt_id, index) => {
            console.log(user, id, cmt_id, index)
            if (user) {
                Assignment.findById(id)
                    .then(Assignment => {
                        for (let i = 0; i < Assignment.comment.length; i++) {
                            if (Assignment.comment[i].cmt_id == cmt_id) {
                                if (Assignment.comment[i].liked.includes(user)) {
                                    Assignment.comment[i].likes -= 1
                                    Assignment.comment[i].liked = Assignment.comment[i].liked.filter(element => element !== user);
                                    console.log("bb");
                                    socket.emit("resultReactComment", index, -1)
                                }
                                else {
                                    if(Assignment.comment[i].au != user){
                                        User.findOne({ username: Assignment.comment[i].au })
                                            .then(User => {
                                                let currentDate = new Date();
                                                let day = currentDate.getDate();
                                                let month = currentDate.getMonth() + 1;
                                                let year = currentDate.getFullYear();
                                                let formattedDate = `${day}/${month}/${year}`;
                                                User.announcement.push({
                                                    title: "Lượt thích bình luận mới",
                                                    time: formattedDate,
                                                    icon: "heart",
                                                    destination: `/assignment/view/${id}`
                                                })
                                                _io.emit("UpdateIsNew", Assignment.comment[i].au)
                                                User.isNew = true
                                                User.save()
                                                    .then()
                                                    .catch()
                                            })
                                            .catch()
                                    }
                                    Assignment.comment[i].likes += 1
                                    Assignment.comment[i].liked.push(user)
                                    socket.emit("resultReactComment", index, 1)
                                }
                                Assignment.markModified('comment');
                                Assignment.save()
                                    .then()
                                    .catch()
                                return;
                            }
                            else {
                                for (let j = 0; j < Assignment.comment[i].commentChild.length; j++) {
                                    if (Assignment.comment[i].commentChild[j].cmt_id == cmt_id) {
                                        if (Assignment.comment[i].commentChild[j].liked.includes(user)) {
                                            Assignment.comment[i].commentChild[j].likes -= 1
                                            Assignment.comment[i].commentChild[j].liked = Assignment.comment[i].commentChild[j].liked.filter(element => element !== user);
                                            socket.emit("resultReactComment", index, -1)
                                        }
                                        else {
                                            Assignment.comment[i].commentChild[j].likes += 1
                                            Assignment.comment[i].commentChild[j].liked.push(user)
                                            if(Assignment.comment[i].commentChild[j].au != user){
                                                User.findOne({ username: Assignment.comment[i].commentChild[j].au })
                                                    .then(User => {
                                                        let currentDate = new Date();
                                                        let day = currentDate.getDate();
                                                        let month = currentDate.getMonth() + 1;
                                                        let year = currentDate.getFullYear();
                                                        let formattedDate = `${day}/${month}/${year}`;
                                                        User.announcement.push({
                                                            title: "Lượt thích bình luận mới",
                                                            time: formattedDate,
                                                            icon: "heart",
                                                            destination: `/assignment/view/${id}`
                                                        })
                                                        _io.emit("UpdateIsNew", Assignment.comment[i].commentChild[j].au)
                                                        User.isNew = true
                                                        User.save()
                                                            .then()
                                                            .catch()
                                                    })
                                                    .catch()
                                            }
                                            socket.emit("resultReactComment", index, 1)
                                        }
                                        Assignment.markModified('comment');
                                        Assignment.save()
                                            .then()
                                            .catch()
                                        return;
                                    }
                                }
                            }
                        }
                    })
                    .catch()
            }
            else {
                socket.emit("ppp", -1, index, "Bạn cần đăng nhập để thích bình luận này")
            }
        })

        socket.on("commentAssignment", (cmt, au, id, cmt_id) => {
            console.log(cmt, au, id, cmt_id)
            if (!cmt) {
                socket.emit("ppp", -1, 0, "Nội dung bình luận không được để trống")
            }
            if (!au) {
                socket.emit("ppp", -1, 0, "Bạn cần đăng nhập để thêm bình luận")
            }
            if (cmt && au) {
                if (cmt_id) {
                    Assignment.findById(id)
                        .then(assignment => {
                            var currentDate = new Date();
                            var day = currentDate.getDate();
                            var month = currentDate.getMonth() + 1;
                            var year = currentDate.getFullYear();
                            var dateString = day + '/' + month + '/' + year;
                            const NewComment = {
                                au: au,
                                cmt: cmt,
                                deleted: 0,
                                deleteAt: "",
                                time: currentDate,
                                date: dateString,
                                cmt_id: objectId(),
                                likes: 0,
                                liked: []
                            }
                            for (let i = 0; i < assignment.comment.length; i++) {
                                if (assignment.comment[i].cmt_id == cmt_id) {
                                    assignment.comment[i].commentChild.push(NewComment)
                                    if(assignment.comment[i].au != au) {
                                        User.findOne({ username: assignment.comment[i].au })
                                            .then(User => {
                                                let currentDate = new Date();
                                                let day = currentDate.getDate();
                                                let month = currentDate.getMonth() + 1;
                                                let year = currentDate.getFullYear();
                                                let formattedDate = `${day}/${month}/${year}`;
                                                User.announcement.push({
                                                    title: "Trả lời bình luận",
                                                    time: formattedDate,
                                                    icon: "comment",
                                                    destination: `/assignment/view/${id}`
                                                })
                                                _io.emit("UpdateIsNew", assignment.comment[i].au)
                                                User.isNew = true
                                                User.save()
                                                    .then()
                                                    .catch()
                                            })
                                            .catch()
                                    }
                                    assignment.markModified('comment');
                                    assignment.save()
                                        .then(() => {
                                            console.log(cmt, au, cmt_id)
                                            socket.emit("commentSocket", cmt, au, dateString, cmt_id)
                                        })
                                        .catch()
                                }
                            }


                        })
                        .catch()
                }
                else {
                    Assignment.findById(id)
                        .then(assignment => {
                            var currentDate = new Date();
                            var day = currentDate.getDate();
                            var month = currentDate.getMonth() + 1;
                            var year = currentDate.getFullYear();
                            var dateString = day + '/' + month + '/' + year;
                            const NewComment = {
                                au: au,
                                cmt: cmt,
                                deleted: 0,
                                deleteAt: "",
                                time: currentDate,
                                date: dateString,
                                cmt_id: objectId(),
                                likes: 0,
                                liked: [],
                                commentChild: []
                            }
                            assignment.comment.push(NewComment)
                            assignment.markModified('comment');
                            assignment.save()
                                .then(() => {
                                    console.log(cmt, au, cmt_id);
                                    socket.emit("commentSocket", cmt, au, dateString, "TrungDzai")
                                })
                                .catch()

                        })
                        .catch()
                }
            }
        })

        socket.on("deleteCommentAssignment", (id, cmt_id) => {
            Assignment.findById(id)
                .then(Assignment => {
                    for (let i = 0; i < Assignment.comment.length; i++) {
                        if (Assignment.comment[i].cmt_id == cmt_id) {
                            Assignment.comment[i].deleted = 1
                            Assignment.comment[i].deleteAt = Date()
                            Assignment.markModified('comment');
                            Assignment.save()
                                .then(() => {
                                    socket.emit("ppp", 2, 0, "Bạn đã xóa bình luận thành công")
                                })
                                .catch()

                            return;

                        }
                        else {
                            for (let j = 0; j < Assignment.comment[i].commentChild.length; j++) {
                                if (Assignment.comment[i].commentChild[j].cmt_id == cmt_id) {
                                    Assignment.comment[i].commentChild[j].deleted = 1
                                    Assignment.comment[i].commentChild[j].deleteAt = Date()
                                    Assignment.markModified('comment');
                                    Assignment.save()
                                        .then(() => {
                                            socket.emit("ppp", 2, 0, "Bạn đã xóa bình luận thành công")
                                        })
                                        .catch()
                                    return;
                                }
                            }
                        }
                    }
                })
                .catch()
        })

        socket.on("reactCommentShowSolution", (user, id, sol_id, index, name) => {
            if (user) {
                Assignment.findById(id)
                    .then(Assignment => {
                        for (let i = 0; i < Assignment.solutions.length; i++) {
                            if (Assignment.solutions[i]._id == sol_id) {
                                if (Assignment.solutions[i].liked.includes(user)) {
                                    Assignment.solutions[i].likes -= 1
                                    Assignment.solutions[i].liked = Assignment.solutions[i].liked.filter(element => element !== user);
                                    User.findOne({ username: name })
                                        .then(User => {
                                            User.score -= parseInt(0.2 * Assignment.score)
                                            var updateFeature = updatePosition(User.score)
                                            User.color = updateFeature[0]
                                            User.position = updateFeature[1]
                                            User.fontWeight = updateFeature[2]
                                            User.markModified("score")
                                            User.save()
                                                .then()
                                                .catch()
                                        })
                                        .catch()
                                    socket.emit("resultReactCommentShowSolution", index, -1)
                                }
                                else {
                                    Assignment.solutions[i].likes += 1
                                    Assignment.solutions[i].liked.push(user)
                                    if(name != user){
                                        User.findOne({ username: name })
                                            .then(User => {
                                                let currentDate = new Date();
                                                let day = currentDate.getDate();
                                                let month = currentDate.getMonth() + 1;
                                                let year = currentDate.getFullYear();
                                                let formattedDate = `${day}/${month}/${year}`;
                                                User.announcement.push({
                                                    title: "Lời giải yêu thích",
                                                    time: formattedDate,
                                                    icon: "heart",
                                                    destination: `/assignment/solution/${id}`
                                                })
                                                User.isNew = true
                                                _io.emit("UpdateIsNew", name)
    
                                                User.score += parseInt(0.2 * Assignment.score)
                                                var updateFeature = updatePosition(User.score)
                                                User.color = updateFeature[0]
                                                User.position = updateFeature[1]
                                                User.fontWeight = updateFeature[2]
                                                User.markModified("score")
                                                User.save()
                                                    .then()
                                                    .catch()
                                            })
                                            .catch()
                                    }
                                    socket.emit("resultReactCommentShowSolution", index, 1)
                                }
                                Assignment.markModified('solutions');
                                Assignment.save()
                                    .then()
                                    .catch()
                                return;
                            }

                        }
                    })
                    .catch()
            }
            else {
                socket.emit("ppp", -1, index, "Bạn cần đăng nhập để thích lời giải này")
            }
        })

        socket.on("viewShowSolutions", (sol_id, id, author, index, name) => {
            assignment.findById(id)
                .then(assignment => {

                    for (let i = 0; i < assignment.solutions.length; i++) {
                        if (assignment.solutions[i]._id == sol_id) {
                            index = i
                            break
                        }
                    }
                    assignment.solutions[index].views += 1
                    if (assignment.solutions[index].whoViews.filter(item => item === name).length <= 3 && name) {
                        User.findOne({ username: author })
                            .then(User => {
                                User.score += parseInt((0.05 + Math.random() * 0.05) * assignment.score)
                                var updateFeature = updatePosition(User.score)
                                User.color = updateFeature[0]
                                User.position = updateFeature[1]
                                User.fontWeight = updateFeature[2]
                                User.markModified("score")
                                User.save()
                                    .then()
                                    .catch()
                            })
                            .catch()
                        assignment.solutions[index].whoViews.push(name);
                    }
                    console.log(123)
                    assignment.markModified("solutions")
                    assignment.save()
                        .then()
                        .catch()

                })
                .catch()
        })

        socket.on("followUser", (UserSession, UserId) => {
            console.log(UserSession, UserId)
            if (UserSession) {
                User.findById(UserId)
                    .then((User) => {
                        if (User.whoFollow.includes(UserSession)) {
                            User.whoFollow = User.whoFollow.filter(item => item !== UserSession);
                            User.follower -= 1
                            User.markModified("whoFollow")
                            User.markModified("follower")
                            User.save()
                                .then(() => {
                                    socket.emit("followUser", -1, User.follower)
                                })
                                .catch()
                        }
                        else {
                            if(UserSession != User.username){
                                let currentDate = new Date();
                                let day = currentDate.getDate();
                                let month = currentDate.getMonth() + 1;
                                let year = currentDate.getFullYear();
                                let formattedDate = `${day}/${month}/${year}`;
                                User.announcement.push({
                                    title: "Người theo dõi mới!",
                                    time: formattedDate,
                                    icon: "users",
                                    destination: `/user/${UserId}`
                                })
                                User.isNew = true
                                _io.emit("UpdateIsNew", User.username)
                            }
                            User.whoFollow.push(UserSession)
                            User.follower += 1
                            User.markModified("whoFollow")
                            User.markModified("follower")
                            User.save()
                                .then(() => {
                                    socket.emit("followUser", 1, User.follower)
                                })
                                .catch()
                        }
                    })
                    .catch()
            }
            else {
                socket.emit("result", "Bạn cần đăng nhập để theo dõi tài khoản này")
            }
        })

        socket.on("deleteSolution", (id, key) => {
            Assignment.findById(key)
                .then(Assignment => {
                    var name = ""
                    for (let solution of Assignment.solutions) {
                        if (solution._id == id) {
                            name = solution.author
                            break
                        }
                    }
                    Assignment.solutions = Assignment.solutions.filter(solution => solution._id != id)
                    Assignment.markModified("solutions")
                    Assignment.save()
                        .then(() => {
                            socket.emit("ppp", 2, 0, "Bạn đã xóa lời giải này thành công")
                            User.findOne({ username: name })
                                .then(User => {
                                    User.score -= parseInt(0.5 * Assignment.score)
                                    var updateFeature = updatePosition(User.score)
                                    User.color = updateFeature[0]
                                    User.position = updateFeature[1]
                                    User.fontWeight = updateFeature[2]
                                    User.markModified("score")
                                    User.save()
                                        .then()
                                        .catch()
                                })
                                .catch()
                        })
                        .catch()

                })
                .catch()
        })

        socket.on("updateContest", value => {
            console.log(value)
            if (value) {
                setTimeout(() => {
                    _io.emit("updateContestReload", true)
                }, 3000)
            }
        })

        socket.on("banParticipant", username => {
            if (username) {
                _io.emit("banUsername", username)
            }
        })
        
        socket.on("readNotice", userId => {
            User.findById(userId)
                .then(User=>{
                    socket.request.session.isNew = false 
                    socket.request.session.save()
                    User.isNew = false
                    User.save()
                        .then()
                        .catch()
                })
                .catch()
        })

        socket.on("ResultUpdateIsNew", (value, username) =>{
            if(value){
                if(socket.request.session.username == username){
                    console.log(username, "ResultUpdateIsNew")
                    User.findOne({username: username})
                        .then(User =>{
                            socket.request.session.isNew = true
                            socket.request.session.announcement = User.announcement.length < 10? User.announcement.reverse() : User.announcement.slice(User.announcement.length - 10).reverse();
                            socket.request.session.save()
                        })
                        .catch()
                }
            }
        })

        socket.on("captureUser", (username, time) => {
            console.log("Capture in contest", username, time)
        })

    }
}

module.exports = new SocketService;