import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ananyasharma1029@gmail.com",
      pass: "nslb vcyh ntro hvwy"
    }
  });

  await transporter.sendMail({
    from: "StudySync",
    to,
    subject,
    text
  });
};