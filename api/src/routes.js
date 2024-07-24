const express = require('express');
const router = express.Router();
const path = require('path');

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.use(express.json());
const crypto = require('crypto');

//temporary files for syntax purposes
folderFile = require(path.resolve('data/folderFile.json'));
userFile = require(path.resolve('data/userFile.json'));
groupFile = require(path.resolve('data/groupFile.json'));

const UserDAO = require(path.resolve('data/UserDAO'));
const TaskDAO = require(path.resolve('data/TaskDAO'));
const FolderDAO = require(path.resolve('data/FolderDAO'));
const GroupDAO = require(path.resolve('data/GroupDAO'));

const {TokenMiddleware, generateToken, removeToken} = require(path.resolve('middleware/TokenMiddleware'));

router.get('/this/is/ping/:url', (req, res) => {
    return res.send("pong: " + req.params.url);
})

//POST api methods

// Log in with an existing user
router.post('/users/login', (req,  res) => {
    if(req.body.username  && req.body.password) {
        UserDAO.userLogin(req.body.username, req.body.password).then(user => {
            
        let result = {
            user: user
        }
    
          generateToken(req, res, user);
          res.status(200).json(result);
        }).catch(err => {
          res.status(400).json({error: err});
        });
    }
    else {
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

    if(req.body.username  && req.body.password && req.body.first_name && req.body.last_name) {

        hashPassword(req.body.username, req.body.password, req.body.first_name, req.body.last_name).then(user => {

            UserDAO.createUser(user).then(registered => {

                //user registered, now need to register settings which should never return an error
                UserDAO.addUserSettings(registered.id).then(registeredSettings => {
                    res.status(200).json("SUCCESS");
                }).catch(err => {
                    res.status(400).json({error: err});
                })
            }).catch(err => {
              res.status(400).json({error: err});
            });
        }).catch(err => {
            res.status(400).json({error: err});
        })
    }
    else {
        res.status(401).json({error: 'Not authenticated'});
    }
});

function hashPassword(user, password, first, last) {
    return new Promise((resolve, reject) => {
        let salt = crypto.randomBytes(16).toString('hex');

        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) { 
                reject("Error: " + err);
            }

            const digest = derivedKey.toString('hex');
            resolve({
                username: user,
                first_name: first,
                last_name: last,
                salt: salt,
                password: digest,
            });
        });
    });
}

// Creates a new folder 
router.post('/folders', (req, res) => {
    FolderDAO.createFolder(req.body.name).then(ans => {
        res.json(ans);
        FolderDAO.addFolderToUser(ans, req.body.user);
    })
});

// Creates a new task in a folder
router.post('/folders/:folderId/newTasks', TokenMiddleware, (req, res) => {
    TaskDAO.createTaskIntoFolder(req.body.taskTitle, req.body.taskDate, req.body.taskDescription, req.params.folderId).then(newTask => {
        res.json(newTask);
    })
});

// Creates a new task in a group
router.post('/groups/:groupId/newTasks', TokenMiddleware, (req, res) => {
    TaskDAO.createTaskIntoGroup(req.body.taskTitle, req.body.taskDate, req.body.taskDescription, req.params.groupId).then(newTask => {
        res.json(newTask);
    })
});

// Creates a new group 
router.post('/groups', TokenMiddleware, (req, res) => {
    GroupDAO.createGroup(req.body.name, req.body.userId).then(ans => {
        res.json(ans);
    })
});

//adds a user to a group
router.post('/groups/users', TokenMiddleware, (req, res) => {
    GroupDAO.addUserToGroup(req.body.id, req.body.userId).then(ans => {
        res.json(ans);
    })
});

//GET api methods

// Get current user
router.get('/users/current', TokenMiddleware, (req,  res) => {
    res.json(req.user);
})

// Gets a user by their user id
router.get('/users/:userId', TokenMiddleware, (req, res) => {
    UserDAO.getUserById(req.params.userId).then(user => {
        res.json(user);
    });
});

// Gets all tasks in a folder
router.get('/folders/:folderId/tasks', (req, res) => {
    TaskDAO.getTaskByFolder(req.params.folderId).then(taskList => {
        res.json(taskList);
    });
});
router.get('/folderlist/:userId', (req, res) => {
    FolderDAO.getFolderByUser(req.params.userId).then(folders => {
        res.json(folders);
    });
});

//gets the groups the user is a part of
router.get('/grouplist/:userId', (req, res) => {
    GroupDAO.getGroupByUser(req.params.userId).then(groups => {
        res.json(groups);
    });
});

router.get('/nongrouplist/:userId', (req, res) => {
    GroupDAO.getGroups().then(groups => {
        res.json(groups);
    })
});

// Gets all tasks in a group
router.get('/grouplist/:groupId/tasks', (req, res) => {
    GroupDAO.getTasksByGroup(req.params.groupId).then(taskList => {
        res.json(taskList);
    });
});

//gets all folders for a certain user ID
router.get('/folderlist/:userId', (req, res) => {
    FolderDAO.getFoldersByUserId().then(folderIds => {
        FolderDAO.get
    });
});

// Gets the settings information for a specific user
router.get('/users/:userId/settings', TokenMiddleware, (req, res) => {
    UserDAO.getUserSettings(req.params.userId).then(settings => {
        res.json(settings);
    });
})

// Gets the groups the user is a part of
router.get('/users/:userId/groups', TokenMiddleware, (req, res) => {
    GroupDAO.getGroupByUser(req.params.userId).then(groups => {
        res.json(groups);
    });
})

// Gets the users that are part of a group
router.get('/groups/:groupId/users', TokenMiddleware, (req, res) => {
    GroupDAO.getUsersByGroup(req.params.groupId).then(users => {
        res.json(users);
    })
})

//gets all tasks in a group
router.get('/groups/:groupId/tasks', TokenMiddleware, (req, res) => {
    GroupDAO.getTasksByGroup(req.params.groupId).then(tasks => {
        res.json(tasks);
    })
})

// Get all groups
router.get('/groups', TokenMiddleware, (req, res) => {
    GroupDAO.getGroups().then(groups => {
        res.json(groups);
    })
})

// PUT methods

// Updates the settings information for a user
router.put('/users/:userId/newSettings', (req,  res) => {
    UserDAO.updateUserSettings(req.body, req.params.userId).then(ans => {
        res.json(ans);
    })
});

// Updates the group information for a user
router.put('users/:userId/updateGroups', TokenMiddleware, (req,  res) => {
    UserDAO.updateUserGroups(req.body, req.params.userId).then(ans => {
        res.json(ans);
    })
});

// Updates a folder
router.put('/folders/:folderId', (req,  res) => {
    FolderDAO.editFolder(req.params.folderId, req.body.folder).then(ans => {
        res.json(ans);
    })
});

//DELETE | /folders/:folderId| Deletes a folder
router.delete('/folders/:folderId', (req, res) => {
    FolderDAO.deleteFolder(req.body.folderId).then(ans => {
        res.json(ans);
        FolderDAO.deleteFolderFromUser(req.body.folderId, req.body.user);
    });
});

//DELETE | /groups/user/:groupId| removes the current user from a group
router.delete('/groups/currentUser', (req, res) => {
    GroupDAO.removeUserFromGroup(req.body.userId, req.body.groupId).then(ans => {
        res.json();
    })
});

//deletes a task
router.delete('/task', (req, res) => {
    console.log("here");
    TaskDAO.deleteTaskFromFolder(req.body.task, req.body.folderId).then(ans => {
        res.json();
    })
});

module.exports = router;