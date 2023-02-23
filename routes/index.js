const express = require('express')
const { 
    getUser, 
    postUser, 
    createGuest, 
    getAllGuest, 
    checkSession, 
    createQRWhatsapp, 
    getGuest, 
    sendMessage,
    isConfirmedGuest,
    deleteGuest,
    updateGuest
} = require('../controllers/index')

const router = express.Router()

router.get('/user:email', getUser)
router.post('/user', postUser)
router.post('/guest', createGuest)
router.delete('/guest', deleteGuest)
router.put('/guest', updateGuest)
router.get('/guest/:email', getAllGuest)
router.get('/guest-invitation/:slug', getGuest)
router.get('/qr-whatsapp', createQRWhatsapp)
router.get('/check-session', checkSession)
router.post('/send-message', sendMessage)
router.post('/confirmed', isConfirmedGuest)

module.exports = router
