import { Router } from 'express'
import { registration, login, profileUpdate, profileDelete, profileDetails, viewUserList, verifyEmail, verifyOTP, passwordReset } from '../controller/userController.js'
import { bulkCheckIndexing, getUserIndexingHistory } from '../controller/indexController.js';
import { initiatePayment, verifyPayment } from '../controller/paymentController.js';
import { submitContactForm } from '../controller/contactController.js'
import { getDashboardData } from '../controller/dashboardController.js'

import Authentication from '../middleware/auth.js'
import checkRole from '../middleware/checkRole.js'


const router=Router()

// User Reg & Login Routes

router.post('/registration', registration)
router.post('/login', login);

// User Profile Routes

router.put('/profileUpdate/:id',Authentication , profileUpdate);
router.delete('/profileDelete/:id',Authentication , checkRole('admin') , profileDelete);
router.post('/profileDetails',Authentication , profileDetails);
router.get('/viewUserList', Authentication , checkRole('admin') , viewUserList);

// User Reset Password Routes

router.get('/verifyEmail/:email', verifyEmail);
router.get('/verifyOTP/:email/:otp', verifyOTP);
router.get('/passwordReset/:email/:otp/:password', passwordReset);

//Indexing Routes

router.post('/bulkCheckIndexing' , bulkCheckIndexing);
router.get('/getUserIndexingHistory' , Authentication, getUserIndexingHistory);

//Contact Routes

router.post('/submitContactForm' , submitContactForm);

//Payment Routes

// router.post('/initiatePayment', Authentication, initiatePayment);
// router.post('/verifyPayment', Authentication, verifyPayment);

//Dashboard Routes

router.get('/getDashboardData', Authentication , checkRole('admin'), getDashboardData);

export default router;