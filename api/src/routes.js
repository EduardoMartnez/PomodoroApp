const express = require('express');
const router = express.Router();
const path = require('path');

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.use(express.json());
const crypto = require('crypto');

const UserDAO = require(path.resolve('data/UserDAO'));
const TaskDAO = require(path.resolve('data/TaskDAO'));

const {TokenMiddleware, generateToken, removeToken} = require(path.resolve('middleware/TokenMiddleware'));

router.get('/this/is/ping/:url', (req, res) => {
    return res.send("pong: " + req.params.url);
})

function hashPassword(user, password) {
    return new Promise((resolve, reject) => {
        let salt = crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) { 
                reject("Error: " + err);
            }
            const digest = derivedKey.toString('hex');
            resolve({
                username: user,
                salt: salt,
                password: digest,
            });
        });
    });
}

//      POST methods

// Log in with an existing user
router.post('/users/login', (req,  res) => {
    if (req.body.username  && req.body.password) {
        UserDAO.loginUser(req.body.username, req.body.password).then(user => {
            generateToken(req, res, user);
            res.status(200).json({user: user});
        }).catch(err => {
            res.status(400).json({error: err});
        });
    } else {
        res.status(401).json({error: 'Not authenticated'});
    }
});

// Log out a user
router.post('/users/logout', (req,  res) => {
    removeToken(req, res);
    res.json({success: true});
});

// Creates a new user 
router.post('/users/registration', (req, res) => {
    //console.log("req: " + req);
    //console.log("req.body: " + req.body);
    //console.log("req Username: " + req.body.username);
    //console.log("req Password: " + req.body.password);
    if (req.body.username  && req.body.password) {
        hashPassword(req.body.username, req.body.password, req.body.first_name, req.body.last_name).then(user => {
            UserDAO.createUser(user).then(user_id => {
                console.log(user_id);
                //user registered, now need to register settings which should never return an error
                UserDAO.createUserSettings(user_id).then(ans => {
                    res.status(200).json("SUCCESS");
                }).catch(err => {
                    console.log("Adding settings to new user ERROR");
                    console.log(err);
                    res.status(400).json({error: err});
                })
            }).catch(err => {
                console.log("Registering new user ERROR");
                console.log(err);
                res.status(400).json({error: err});
            });
        }).catch(err => {
            console.log("Hash password ERROR");
            console.log(err);
            res.status(400).json({error: err});
        })
    } else {
        res.status(401).json({error: 'Not authenticated'});
    }
});

//      GET methods

// Get current user
router.get('/users/current', TokenMiddleware, (req,  res) => {
    res.json(req.user);
})

// Gets a user by their user id
router.get('/users/:user_id', TokenMiddleware, (req, res) => {
    UserDAO.getUserById(req.params.user_id).then(user => {
        res.json(user);
    });
});

// Gets the settings information for a specific user
router.get('/users/:user_id/settings', TokenMiddleware, (req, res) => {
    UserDAO.getUserSettings(req.params.user_id).then(settings => {
        res.json(settings);
    });
})

//      PUT methods

// Updates the settings information for a user
router.put('/users/:user_id/new_settings', (req,  res) => {
    UserDAO.updateUserSettings(req.body, req.params.user_id).then(ans => {
        res.json(ans);
    })
});

//      DELETE methods

//deletes a task
router.delete('/task', (req, res) => {
    // console.log("here");
    TaskDAO.deleteTaskFromFolder(req.body.task, req.body.folderId).then(ans => {
        res.json();
    })
});

module.exports = router;