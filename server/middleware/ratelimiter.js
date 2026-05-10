// middlewares/rateLimiter.js

import rateLimit from "express-rate-limit"  // by default use req.ip ,user A , userB
import RedisStore from "rate-limit-redis"
import { redis } from "../config/connection.js"

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
   keyGenerator: (req) => {
  return req.user?.id || req.ip
},
  windowMs: 15 * 60 * 1000, // 5 minutes
  max: 1000, // limit each IP

  message: {
    msg: "Too many requests, please try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
keyGenerator: (req) => req.ip,
  windowMs: 15 * 60 * 1000,
  max: 100, // only 10 attempts

  message: {
    msg: "Too many login attempts, try later",
  },
})