import { configDotenv } from "dotenv";
import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import User from '../models/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisCli from '../../../redis'

configDotenv();

const IsUser = AppDataSoure.getRepository(User);
const secertKey:string = process.env.SECRET || 'jwt-secret-key';

const logIn = async (req:Request, res:Response) => {
  try {
    const { nick, password } = req.body;
    const thisUser = await IsUser.findOneBy({ nick: nick, password: password });
    if (!thisUser) {
      return res.status(404).json({
        'error' : '사용자를 찾을 수 없습니다.'
      })
    }
    if(!bcrypt.compareSync(password, thisUser.password)){
      return res.status(409).json({
          "error": "비밀번호가 일치하지 않습니다."
      })
    }

    const accessToken = await generateAccessToken(thisUser.userId);
    const refreshToken = await generateRefreshToken(accessToken);

    redisCli.set(String(thisUser.userId), refreshToken);

    return res.status(201).json({
      accessToken,
      refreshToken
    })
  }
  catch (error) {
    return error;
  }
}

const generateAccessToken = (userId: number) => {
  const accessToken = jwt.sign({ id: userId }, secertKey, { expiresIn: '3h' })
  return accessToken;
}

const generateRefreshToken = (accessToken: String) => {
  const refreshToken = jwt.sign({ accessToken }, secertKey, { expiresIn: '7d' })
  return refreshToken;
}

export { logIn };