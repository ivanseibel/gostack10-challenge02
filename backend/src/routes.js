import { Router } from 'express';
import multer from 'multer';

// import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import DeliverymanController from './app/controllers/DeliverymanController';
import UserController from './app/controllers/UserController';
import AvatarController from './app/controllers/AvatarController';
import multerConfig from './config/multer';
import DeliveryController from './app/controllers/DeliveryController';
import SignatureController from './app/controllers/SignatureController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';

const routes = Router();
const upload = multer(multerConfig);

function OnlyAdmin(req, res, next) {
  if (!req.userIsAdmin) {
    return res.status(401).json({ error: 'User must be administrator' });
  }
  return next();
}

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', OnlyAdmin, RecipientController.store);
routes.put('/recipients/:id', OnlyAdmin, RecipientController.update);
routes.get('/recipients', OnlyAdmin, RecipientController.index);

routes.post('/users', OnlyAdmin, UserController.store);
routes.put('/users', OnlyAdmin, UserController.update);
routes.get('/users', OnlyAdmin, UserController.index);

routes.post('/deliverymans', OnlyAdmin, DeliverymanController.store);
routes.put('/deliverymans/:id', OnlyAdmin, DeliverymanController.update);
routes.get('/deliverymans', OnlyAdmin, DeliverymanController.index);
routes.delete('/deliverymans/:id', OnlyAdmin, DeliverymanController.delete);
routes.get('/deliverymans/:id/deliveries', DeliveryStatusController.index);

routes.post('/deliveries', OnlyAdmin, DeliveryController.store);
routes.put('/deliveries/:id', OnlyAdmin, DeliveryController.update);
routes.get('/deliveries', OnlyAdmin, DeliveryController.index);

routes.post(
  '/avatars',
  OnlyAdmin,
  upload.single('file'),
  AvatarController.store
);
routes.put(
  '/avatars/:id',
  OnlyAdmin,
  upload.single('file'),
  AvatarController.update
);

routes.post(
  '/signatures',
  OnlyAdmin,
  upload.single('file'),
  SignatureController.store
);
routes.put(
  '/signatures/:id',
  OnlyAdmin,
  upload.single('file'),
  SignatureController.update
);

export default routes;