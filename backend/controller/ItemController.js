import Items from "../models/ItemModel.js";
import User from "../models/UserModel.js"

export const getItems = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Items.findAll({
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Items.findAll({
                attributes: ['uuid', 'name', 'credit', 'quantityOnHand'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getItemsById = async (req, res) => {
    try {
        const items = await Items.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!items) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Items.findOne({
                where:{
                    id: items.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Items.findOne({
                attributes:['uuid','name','credit'],
                where:{
                    id: items.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createItems = async (req, res) => {
    const { uuid, name, debit, credit } = req.body;
    try {
        await Items.create({
            uuid: uuid,
            name: name,
            debit: debit,
            credit: credit,
            userId: req.userId
        })
        res.status(201).json({ msg: "Items is created succesfully" })
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateItems = async(req, res) => {
    try {
        const items = await Items.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!items) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await items.update({name, credit},{
                where:{
                    id: items.id
                }
            });
        }
        res.status(200).json({msg: "Product updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteItems = async(req, res) => {
    try {
        const items = await Items.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!items) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await items.destroy({
                where:{
                    id: items.id
                }
            });
        }
        res.status(200).json({msg: "Product deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}