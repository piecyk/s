import express         from 'express';
import {create, login} from './user';

let router = express.Router();

//curl -X POST -H "Content-Type: application/json" -d '{"email":"test@wp.pl","password":"test"}' http://localhost:3000/register
router.post('/register', (req, res, next) => create(req.body.email, req.body.password, res));

router.post('/login', (req, res, next) =>  login(req.body.email, req.body.password, res));

export default router;
