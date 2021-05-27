const { UniqueConstraintError } = require('sequelize');
const router = require('express').Router();
const {UserModel} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/user');
const e = require('express');

let bOne = bcrypt.hashSync('password123', 13);
let bTwo = bcrypt.hashSync('abc123', 13);
console.log('B-ONE: ', bOne);
console.log('B-TWO: ', bTwo);
console.log('One to Two SAME?:', bcrypt.compareSync(bOne,bTwo))
console.log('One to String SAME?:', bcrypt.compareSync('abc123',bTwo))

router.post("/register", async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    try {
        const newUser = await UserModel.create({
            firstName,
            lastName, 
            email,
            password: bcrypt.hashSync(password, 13)
        })

        const token = jwt.sign(
            {id: newUser.id}, 
            process.env.JWT_SECRET,
            {expiresIn: 60 * 60 * 24} 
        )
        
        res.status(201).json({
            message: "User Registered!",
            user: newUser,
            token
        })
    } catch (err) {
        if( error instanceof UniqueConstraintError){
            res.status(409).json({
                message: `Email already in user`
            });
        }else {
            res.status(500).json({
                error: `Failed to register use: ${error}`
            })
        }
    }
})


router.post("/login", async (req, res)=> {
    let {email, password} = req.body;

    // let email = req.body.email;
    // let password = req.body.password;

    try {
        let loginUser = await UserModel.findOne({
            where: {email: email},

        });
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if(passwordComparison){

                let token = jwt.sign(
                   {id: loginUser.id},
                   process.env.JWT_SECRET,
                   {expiresIn: 60 * 60* 24}
                )

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    token
                });

            }else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }

        }else {
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }

    }catch (err){
        res.status(500).json({
            message: "Failed to log user in"
        })
    }

});




module.exports = router;