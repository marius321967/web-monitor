import joi from 'joi'

export default joi.object().pattern(
  /./,
  joi.object({
    email: joi.string()
      .email()
      .required(),
  })
).required()
