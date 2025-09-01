// config.js
import dotenv from 'dotenv';
dotenv.config();

/* -----------------------------------------------------------
   Centralised settings for the VAPT back-end
----------------------------------------------------------- */

export const PORT      = process.env.PORT      || 3001;      // Express port
export const ZAP_HOST  = process.env.ZAP_HOST  || 'localhost';
export const ZAP_PORT  = process.env.ZAP_PORT  || 8080;
export const ZAP_KEY   = process.env.ZAP_KEY   || 'q1uvd9crju662p4ere2l91cs44';

export const ZAP_URL   = `http://${ZAP_HOST}:${ZAP_PORT}`;   // Convenience
