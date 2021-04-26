import { Router } from 'express';
import mainRouter from './main.routes';

const routes = Router();

routes.use('/', mainRouter);

export default routes;