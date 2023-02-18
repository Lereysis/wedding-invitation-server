const createHttpError = require('http-errors')
const { User, Guest } = require('../database/models')
const { endpointResponse } = require('../helpers/success')
const { catchAsync } = require('../helpers/catchAsync')
const { Client } = require('whatsapp-web.js');

const client = new Client();

module.exports = {
  get: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findAll()
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: response,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - GET]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  post: catchAsync(async (req, res, next) => {
    try {
      const response = await User.create({...req.body})
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: response,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  createGuest: catchAsync(async (req,res,next) => {
    try {
      const user = await User.findOne({
        where: {
          email:req.body.email
        }
      })
      const response = await user.createGuest({
        name:req.body.name,
        numberPhone:req.body.numberPhone,
        numberGuest:req.body.numberGuest
      })
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: response,
      })
    } catch (error) {
      console.log(error)
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  getAllGuest: catchAsync(async (req,res,next)=>{
    try {
      const user = await User.findOne({
        where: {
          email:req.params.email
        }
      })
      const response = await user.getGuests()
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: response,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  isConfirmedGuest: catchAsync(async (req,res,next)=>{
    try {
      const { numberPhone } = req.body
      const user = await Guest.update({isConfirmed:true},{
        where: {
          numberPhone
        }
      })
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: user,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  sendInvitation: catchAsync(async (req,res,next)=>{
    try {
      const user = await User.findOne({
        where: {
          email:req.params.email
        }
      })
      const response = await user.getGuests()
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: response,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  createQRWhatsapp: catchAsync(async (req,res,next)=>{
    try {
      client.on('qr', qr => {
        endpointResponse({
          res,
          message: 'QR GENERATED',
          body: qr,
        })
      });
      client.initialize()       
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  checkSession: catchAsync(async (req,res,next)=>{
    try {
      endpointResponse({
        res,
        message: 'QR GENERATED',
        body: await client.getState(),
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
  sendMessage: catchAsync(async (req,res,next)=>{
    try {
      const { message, number } = req.body
      endpointResponse({
        res,
        message: 'QR GENERATED',
        body: await client.getState(),
      })
      const sanitized_number = number.toString().replace(/[- )(]/g, ""); 
      const final_number = `57${sanitized_number.substring(sanitized_number.length - 10)}`;
      const number_details = await client.getNumberId(final_number);
      if (number_details) {
          await client.sendMessage(number_details._serialized, `Hola que tal, como estas? estoy feliz de invitarte a mi boda para ver tu invitacion puedes entrar al link ⛪️ \n \n \n ${message}`);
      } else {
          console.log(final_number, "Mobile number is not registered");
      }
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
}

client.initialize();