import Joi from 'joi';

const validateEnv = function validateEnv(env: { [k: string]: unknown }): Joi.ValidationResult {
  const schema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().required(),
  }).unknown();
  const validate = schema.validate(env);
  return validate;
};

export default validateEnv;
