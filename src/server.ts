import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import {PrismaClient, ROLE } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors';
import { hashSync } from 'bcrypt';

import cors from 'cors';

const app:Express = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5023',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  }));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

app.use('/api',rootRouter)
app.get('/', (req, res)=>{
    res.send('GROUP-2 GIT-INSPIRED ASSIGNMENT SUBMISSION PLATFORM DEVELOPMENT')
})

export const prismaUse = new PrismaClient()

app.use(errorMiddleware);

app.listen(PORT, async () => {
  try {
      const existingUser = await prismaUse.user.findFirst({
          where: {
              role: ROLE.ADMIN
          }
      });

      if (!existingUser) {
          const hashedPassword = hashSync("RashHalimahGloria", 10);
          const staffID = 'GROUP-2'
          await prismaUse.user.create({
              data: {
                  firstName: "Rashida",
                  lastName:  "Halimah",
                  email:     "gloria@amalitech.org",
                  staffId:    staffID,
                  password:  hashedPassword,
                  role:      ROLE.ADMIN
              }
          });

          console.log('User created successfully');
      } else {
          console.log('Admin user already exists');
      }
  } catch (error) {
      console.error('Error while creating user:', error);
  }
});
