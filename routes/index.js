const express = require('express')
const { 
    getUsers, 
    postUser, 
    createGuest, 
    getAllGuest, 
    checkSession, 
    createQRWhatsapp, 
    getGuest, 
    sendMessage,
    isConfirmedGuest
} = require('../controllers/index')

const router = express.Router()

// example of a route with index controller get function
router.get('/', getUsers)
router.post('/user', postUser)
router.post('/guest', createGuest)
router.get('/guest/:email', getAllGuest)
router.get('/guest-invitation/:slug', getGuest)
router.get('/qr-whatsapp', createQRWhatsapp)
router.get('/check-session', checkSession)
router.post('/send-message', sendMessage)
router.post('/confirmed', isConfirmedGuest)

module.exports = router
