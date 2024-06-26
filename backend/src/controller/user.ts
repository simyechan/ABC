import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import User from "../models/user.entity";
import { hashSync } from "bcrypt";

const IsUser = AppDataSoure.getRepository(User);

const signUp = async (req: Request, res: Response) => {
  const { nick, password } = req.body;

  if (await IsUser.findOneBy({ nick: nick, password: password })) {
    return res.status(409).json({ error: "계정이 이미 존재합니다." });
  }

  if (await IsUser.findOneBy({ nick: nick })) {
    return res.status(409).json({ error: "별명이 이미 존재합니다." });
  }

  const hashed = hashSync(password, 10);

  await IsUser.save({ nick: nick, password: hashed });

  return res.status(201).json({
    data: null,
    status: 201,
    statusMsg: "회원가입 완료",
  });
};

const getNick = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;

    const thisUser = await IsUser.findOneBy({ userId: id });

    if (!thisUser) {
      res.status(404).json({
        error: "정보를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      nick: thisUser?.nick,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ err: "닉네임을 불러오는 동안 문제가 생겼습니다." });
  }
};

export { signUp, getNick };
