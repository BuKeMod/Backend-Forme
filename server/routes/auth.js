import express from 'express';

// Import controller functions
import create from '../controllers/register.js';
import login from '../controllers/login.js';

const router = express.Router();

//@ENDPOINT 

router.post('/register', create);
router.post('/login', login);

// router.put('/users/:Id', update);
// router.delete('/users/:todoId', remove);

export default router; 
