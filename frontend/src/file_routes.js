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

// Send the create task page
router.get('/createTask', (req, res) => {
    res.sendFile(__dirname + '/templates/createTask.html');
})

// Send the settings page
router.get('/settings', (req, res) => {
    res.sendFile(__dirname + '/templates/settings.html');
})

router.get('/offline', (req, res) => {
    res.sendFile(__dirname + '/templates/offline.html');
})

module.exports = router;
