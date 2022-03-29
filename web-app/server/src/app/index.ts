import * as express from 'express';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

// register routes

app.get('/users', (req: Request, res: Response) => {
  // here we will have logic to return all users
});

app.get('/users/:id', (req: Request, res: Response) => {
  // here we will have logic to return user by id
});

app.post('/users', (req: Request, res: Response) => {
  // here we will have logic to save a user
});

app.put('/users/:id', (req: Request, res: Response) => {
  // here we will have logic to update a user by a given user id
});

app.delete('/users/:id', (req: Request, res: Response) => {
  // here we will have logic to delete a user by a given user id
});

const listenApp = () => app.listen(3000);
export default listenApp;
