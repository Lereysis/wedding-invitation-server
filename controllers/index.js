const createHttpError = require('http-errors')
const { User, Guest } = require('../database/models')
const { endpointResponse } = require('../helpers/success')
const { Op } = require("sequelize");
const { catchAsync } = require('../helpers/catchAsync')
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer:{
    args:['--no-sandbox']
  }
});

client.initialize()

module.exports = {
  getUser: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findOne({
        where: {
          email:req.params.email
        }
      })
      endpointResponse({
        res,
        message: 'Success',
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
  postUser: catchAsync(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          email:req.body.email
        }
      })
      if (user instanceof User) {
        throw new Error('Mail already exists on our platform')
      }
      const response = await User.create({...req.body})
      endpointResponse({
        res,
        message: 'Success',
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

      const guest = await Guest.findOne({
        where: {
          numberPhone:req.body.numberPhone,
        }
      })

      if (guest instanceof Guest) {
        throw new Error('Number Phone already exists on our platform')
      }

      const user = await User.findOne({
        where: {
          email:req.body.email
        }
      })
      const creatingSlug = req.body.name.trim().toLowerCase().replace(/ /g,"-");
      const response = await user.createGuest({
        name:req.body.name,
        numberPhone:req.body.numberPhone,
        slug:creatingSlug,
        numberGuest:req.body.numberGuest,
        messageCustomize:req.body.messageCustomize
      })
      endpointResponse({
        res,
        message: 'Success',
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
  getGuest: catchAsync(async (req,res,next) => {
    try {
      const response = await Guest.findOne({
        where: {
          slug:req.params.slug
        }
      })
      endpointResponse({
        res,
        message: 'Success',
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
  deleteGuest: catchAsync(async (req,res,next) => {
    try {
      const { numberPhone } = req.body
      
      await Guest.destroy({
        where: {
          numberPhone: req.body.numberPhone
        }
      })
      endpointResponse({
        res,
        message: 'Success',
        body: true,
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
  updateGuest: catchAsync(async (req,res,next) => {
    try {
      const { oldGuest, newGuest } = req.body
     
      const response = await Guest.update({...newGuest},{
        where: {...oldGuest}
      })
      endpointResponse({
        res,
        message: 'Success',
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
      const {search,limit,page,isConfirmed} = req.query
      const user = await User.findOne({
        where: {
          email:req.params.email,
        }
      })
      let limitResult = limit || 10
      let searchResult = search || ''
      let response = []

      let totalGuestDatabase = await user.getGuests()

      if (Boolean(isConfirmed)) {
        response = await user.getGuests({
          where:{
            isConfirmed: {
              [Op.eq]: isConfirmed.toLowerCase() == 'true' ? true : false,
            },
            name: {
              [Op.like]: `%${searchResult}%`,
            },
          },
          limit: limitResult,
          offset: Number(page) ? Number(page) * Number(limitResult) : 0
        })
      } else {
        response = await user.getGuests({
          where: {
            name: {
              [Op.like]: `%${searchResult}%`,
            },
          },
          limit: limitResult,
          offset: Number(page) ? Number(page) * Number(limitResult) : 0
        })
      } 
      const totalGuest = response.length
      endpointResponse({
        res,
        message: 'Success',
        meta:{
          pagination:{
            totalGuests: totalGuestDatabase.length,
            page: Number(page) + 1,
            next:  Number(page) + 1 > Math.ceil(totalGuest / Number(limitResult)) ? null : Number(page) + 1 + 1 ,
            previous: Number(page) - 1 + 1 <= 0 || Number(page) - 1 + 1 > Math.ceil(totalGuest / Number(limitResult)) ? null : Number(page) - 1 + 1 
          }
        },
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
        message: 'Success',
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
  createQRWhatsapp: catchAsync(async (req,res,next)=>{
    try {
      client.on('qr', qr => {
        endpointResponse({
          res,
          message: 'QR GENERATED',
          body: qr,
        })
      });
      
      // client.initialize()
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
    // client.initialize()
  }),
  checkSession: catchAsync(async (req,res,next)=>{
    try {
      endpointResponse({
        res,
        message: 'Success',
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
      const { url, number, message } = req.body
      endpointResponse({
        res,
        message: 'Sent success',
        body: await client.getState(),
      })
      const sanitized_number = number.toString().replace(/[- )(]/g, ""); 
      const number_details = await client.getNumberId(sanitized_number);
      await client.sendMessage(number_details._serialized, `${message} \n \n ${url.trim()}`);
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - POST]: ${error.message}`,
      )
      next(httpError)
    }
  }),
}

