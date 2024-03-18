import { configDotenv } from "dotenv";
import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import User from '../models/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisCli from '../../../redis'
import { access } from "fs";

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

const logOut = async (req:Request, res:Response) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({
        error: '토큰이 전송되지 않았습니다.'
        
      });
    }
      const decodedToken: any = jwt.decode(accessToken);
      if (!decodedToken || !decodedToken.id) {
        return res.status(400).json({
          error: '유효하지 않은 토큰입니다.'
        })
      }

    const Id = decodedToken.id;

    redisCli.del(String(Id));

    return res.status(200).json({
      message: '로그아웃이 성공적으로 수행되었습니다.'
    });
  } catch (err) {
    return res.status(500).json({
      error: '로그아웃을 수행하는 중에 문제가 발생했습니다.'
    });
  }
}

const refreshAccessToken = async(req:Request, res:Response) => {
  try {
    const refreshToken = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        error: '리프레시 토큰이 전송되지 않았습니다.'
      });
    }

    const userId = await redisCli.get(refreshToken);
    if(!userId) {
      return res.status(401).json({
        error: '유효하지 않은 리프레시 토큰입니다.'
      });
    }

    const accessToken = generateAccessToken(Number(userId));

    return res.status(200).json({
      accessToken: accessToken
    });
  } catch {
    return res.status(500).json({
      error: '토큰 재발급을 수행하는 중에 문제가 발생했습니다.'
    });
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


export { logIn, logOut, refreshAccessToken };