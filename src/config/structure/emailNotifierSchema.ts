import joi from 'joi'

export default joi.object({
  host: joi.string()
    .hostname()
    .required(),

  port: joi.number()
    .strict()
    .port()
    .required(),

  secure: joi.bool()
    .strict()
    .required(),

  auth: joi.object({
    user: joi.string()
      .required(),

    pass: joi.string()
      .required()
  }).required()
}).required()
