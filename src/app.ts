import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router  from './routers'
import errorHandler from './middleware/errorHandler'
import sequelizeConnection from './config/connection'
import swaggerDocs from './config/swagger'

dotenv.config()

const app = express()
const port = process.env.APP_PORT
const appName = process.env.APP_NAME

app.use(cors())
app.use(express.json());
app.use("/api", router)
app.use(errorHandler)

app.get('/api/users', (req:Request, res:Response) => {
  res.send('Hello World!')
})

// export const server = app.listen(port, () => {
//   console.log(`Example app for ${appName} listening on port ${port}`)
// })

// export const server = sequelizeConnection.sync()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Example app for ${appName} listening on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Error syncing database:', err);
//   });

export const server = app.listen(port, () => {
  console.log(`Example app for ${appName} listening on port ${port}`);
  sequelizeConnection.sync()
    .then(() => {
      console.log('Database synced successfully.');
    })
    .catch((err) => {
      console.error('Error syncing database:', err);
    });
});


export default app;