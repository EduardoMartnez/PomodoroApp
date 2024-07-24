const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.json());
// router.use(express.static('static'));
// router.use(express.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/main.html');
})

// Send the login page
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/templates/login.html');
})

// Send the register page
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/templates/register.html');
})

// Send the create task page
router.get('/createTask', (req, res) => {
    res.sendFile(__dirname + '/templates/createTask.html');
})

// Send the folder view page
router.get('/folder', (req, res) => {
    res.sendFile(__dirname + '/templates/folder.html');
})

// Send the settings page
router.get('/settings', (req, res) => {
    res.sendFile(__dirname + '/templates/settings.html');
})

router.get('/group', (req, res) => {
    res.sendFile(__dirname + '/templates/group.html');
})

router.get('/offline', (req, res) => {
    res.sendFile(__dirname + '/templates/offline.html');
})



module.exports = router;