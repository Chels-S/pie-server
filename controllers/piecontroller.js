// const express = require('express');
// const router = express.Router();
const router = require('express').Router();
const {PieModel} = require('../models');
const middleware = require('../middleware');

// router.get('/', (req, res)=> res.send('I love pies!'));

router.get("/", async (req, res) => {
    try {
        const allPies = await PieModel.findAll();
        
        res.status(200).json(allPies);
    } catch(err){
        res.status(500).json({
            error: err
        })
    }
})

router.post('/', middleware.validateSession, async (req, res) =>{
    const {
        nameOfPie,
        baseOfPie,
        crust,
        timeToBake,
        servings,
        ratings
    } = req.body;
    try {
        const Pie = await PieModel.create({
        nameOfPie,
        baseOfPie,
        crust,
        timeToBake,
        servings,
        ratings 
        });

        res.status(201).json({
            message: "Pie successfully created!",
            Pie
        })
    }catch(err){
        res.status(500).json({
            message: `Failed to create pie: ${err}`
        })

    }
});

router.get('/name/:name', async (req, res) => {
    try {
        const locatedPie = await PieModel.findOne({
            where: {nameOfPie: req.params.name} 
        })

        res.status(200).json({
            message: "Pie(s) successfully retrieved",
            pie: locatedPie
        })
    }catch (err){
        res.status(500).json({
            message: `Failed to retrieve pies ${err}`
        })
    }
} )


router.put('/:id', middleware.validateSession, async (req, res) =>{
    const { nameOfPie, baseOfPie, crust, timeToBake, servings, ratings} = req.body;

    try {
        const pieUpdated = await PieModel.update({nameOfPie, baseOfPie, crust, timeToBake, servings, ratings},
            {where: {id: req.params.id}}
            )

            res.status(200).json({
                message: "Pie successfully updated",
                pieUpdated
            })

    }catch (err) {
        res.status(500).json({
            message: `Failed to update pie: ${err}`
        })
    }
})


router.delete('/delete/:id', middleware.validateSession, async (req, res) =>{
    try {
        const pieDeleted = await PieModel.destroy({
            where: {id: req.params.id}
        })

            res.status(200).json({
                message: "Pie successfully deleted",
                pieDeleted
            })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete pie: ${err}`
        })
    }
})

module.exports = router;