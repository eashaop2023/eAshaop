import Joi from 'joi';

const schema = Joi.object({
  dob: Joi.date()
    .less('now')
    .required()
    .messages({
      'date.less': 'DOB cannot be in the future',
      'any.required': 'DOB is required',
    }),
});
