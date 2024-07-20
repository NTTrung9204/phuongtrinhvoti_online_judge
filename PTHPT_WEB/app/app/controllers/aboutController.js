const coreteam = require('../models/coreteam');
const activePage = 5
class about {
    
    // [GET] /
    index(req, res, next) {
        const user = req.session
        if(user.deleted == '1') {
            res.redirect('/')
        }
        else{
            coreteam.find()
                .then(coreteam => {
                    coreteam = coreteam.map(coreteam => coreteam.toJSON())
                    res.render('about/about',{user, activePage, coreteam})
                })
                .catch()
        }
    }

}

module.exports = new about;
