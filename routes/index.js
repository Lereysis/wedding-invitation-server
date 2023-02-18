const express = require('express')
const { 
    get, 
    post, 
    createGuest, 
    getAllGuest, 
    checkSession, 
    createQRWhatsapp, 
    sendMessage,
    isConfirmedGuest
} = require('../controllers/index')

const router = express.Router()

// example of a route with index controller get function
router.get('/', get)
router.post('/user', post)
router.post('/guest', createGuest)
router.get('/guest/:email', getAllGuest)
router.get('/qr-whatsapp', createQRWhatsapp)
router.get('/check-session', checkSession)
router.post('/send-message', sendMessage)
router.post('/confirmed', isConfirmedGuest)

module.exports = router
