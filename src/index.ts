import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import cron from 'node-cron';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './config';
import routes from './routes';
// import { SpreadsheetService, userService, OAuthService } from './service';

const production = env.NODE_ENV === 'LIVE';

// const oauthService = new OAuthService();
// const spreadsheetService = new SpreadsheetService(oauthService.getAuthClient(), userService);

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set('trust proxy', 1);

app.use(
  rateLimit({
    // Limit each IP to 50 requests for every minute.
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: 'Too many requests from this IP, please try again after an hour.',
  })
);

if (!production) {
  app.use(errorhandler());
}

// // Update the spreadsheet daily at 12:00 AM
// cron.schedule('0 0 * * *', async () => {
//   try {
//     await spreadsheetService.createAndPopulateSpreadsheet();
//     console.log('Spreadsheet updated successfully.');
//   } catch (error) {
//     console.error('Failed to update the spreadsheet:', error);
//   }
// });

// run the cron every 5 seconds
// cron.schedule('*/5 * * * * *', async () => {
//   try {
//     // await spreadsheetService.createAndPopulateSpreadsheet();
//     const usersWithReport = await userService.getUsersWithActiveReports();
//     const users = await userService.getAllUsers();

//     console.log('users with report', usersWithReport.length);
//     console.log('users', users.length);
//     console.log('users without report', users.length - usersWithReport.length);
//     console.log('Spreadsheet updated successfully.');
//   } catch (error) {
//     console.error('Failed to update the spreadsheet:', error);
//   }
// });

app.use(express.static('assets'));
app.use('/v1.0', routes);

//greet
app.get('/', (req: Request, res: Response) => {
  res.send(
    `${
      process.env.environment === 'production'
        ? 'Welcome to algofanatics production environment'
        : 'Welcome to algofanatics staging environment'
    }`
  );
});

app.all('/*', (req: Request, res: Response, next) => {
  next(new Error('Resource unavailable'));
});

app.use((err: any, req: Request, res: Response) => {
  res.status(400).send({
    success: false,
    message: err.message.toLowerCase().includes('duplicate key')
      ? 'Account already exists'
      : err.message,
  });
});

export default app;
