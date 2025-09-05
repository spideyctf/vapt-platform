// config.js
import dotenv from 'dotenv';
dotenv.config();

/* -----------------------------------------------------------
   Centralised settings for the VAPT back-end
----------------------------------------------------------- */

export const PORT      = process.env.PORT      || 3001;      // Express port

// ZAP Configuration (already working)
export const ZAP_HOST  = process.env.ZAP_HOST  || 'localhost';
export const ZAP_PORT  = process.env.ZAP_PORT  || 8080;
export const ZAP_KEY   = process.env.ZAP_KEY   || 'q1uvd9crju662p4ere2l91cs44';
export const ZAP_URL   = `http://${ZAP_HOST}:${ZAP_PORT}`;

// MobSF Configuration
export const MOBSF_HOST = process.env.MOBSF_HOST || 'localhost';
export const MOBSF_PORT = process.env.MOBSF_PORT || 8000;
export const MOBSF_API_KEY = process.env.MOBSF_API_KEY || '3e7d2734b513a5c3260fdc58f91747ffc4f9e5da5bd2c3d0bf2696c7deb4aca9';
export const MOBSF_URL = `http://${MOBSF_HOST}:${MOBSF_PORT}`;
