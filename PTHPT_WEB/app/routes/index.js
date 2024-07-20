const siteRouter = require('./site');
const registerRouter = require('./register');
const LoginRouter = require('./login');
const AdminRouter = require('./admin');
const AssignmentRouter = require('./assignment');
const memberRouter = require('./member');
const contestRouter = require('./contest');
const userRouter = require('./user');
const aboutRouter = require('./about');
const chatRouter = require('./chat');
const AnnouncementRouter = require('./announcement');
const submissionRouter = require('./submission')
const sendMailRouter = require('./sendMail')

function routes(app) {
    app.use('/assignment', AssignmentRouter);
    app.use('/about', aboutRouter);
    app.use('/user', userRouter);
    app.use('/contest', contestRouter);
    app.use('/member', memberRouter);
    app.use('/register', registerRouter);
    app.use('/login', LoginRouter);
    app.use('/admin', AdminRouter);
    app.use('/announcement', AnnouncementRouter);
    app.use('/chat', chatRouter)
    app.use('/submission', submissionRouter)
    app.use('/sendMail', sendMailRouter)
    app.use('/', siteRouter);
}

module.exports = routes;