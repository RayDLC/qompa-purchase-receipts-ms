import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    DATABASE_URL: string;

    API_KEY_OPENAI: string;
}

const envsSchema = joi.object({
    DATABASE_URL: joi.string().uri().required(),

    API_KEY_OPENAI: joi.string().required(),
}).unknown(true);

const { value, error } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
    DATABASE_URL: envVars.DATABASE_URL,

    API_KEY_OPENAI: envVars.API_KEY_OPENAI,
}