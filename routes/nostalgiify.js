const { Router } = require('express');
const { check } = require('express-validator');
const {
    startPermission,
    receiveCallback,
    createPlaylist,
} = require('../controllers/nostalgiify');
const { fieldValidator } = require('../middlewares/fieldValidator');

const router = Router();

router.get('/start', startPermission);

router.post('/callback',[
    check('code', 'The code is required').not().isEmpty(),
    check('code', 'The code must be a string').isString(),
] ,receiveCallback);

//! year, month, day must be strings
router.post(
    '/createplaylist',
    [
        check('access_token', 'The access token is required').not().isEmpty(),
        check('user_id', 'The user id is required').not().isEmpty(),
        check('year', 'The year is required').not().isEmpty(),
        check('year', 'The year must be a string').isString(),
        check('month', 'The month is required').not().isEmpty(),
        check('month', 'The month must be a string').isString(),
        check('month', 'The month must be a two-digit number').matches(
            /^(0[1-9]|1[0-2])$/
        ),
        check('day', 'The day is required').not().isEmpty(),
        check('day', 'The day must be a string').isString(),
        check('day', 'The day must be a two-digit number').matches(
            /^(0[1-9]|[12][0-9]|3[01])$/
        ),
        fieldValidator,
    ],
    createPlaylist
);

module.exports = router;
