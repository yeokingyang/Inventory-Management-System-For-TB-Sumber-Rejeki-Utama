import Items from "../models/ItemModel.js";
import User from "../models/UserModel.js"
import {Op} from "sequelize"

export const getItems = async (req, res) => {
 /*   try {
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
                attributes: ['iuid', 'name', 'credit', 'quantityOnHand'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        await updateQuantityOnHand();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    } */

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Items.count({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                iuid: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Items.findAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                iuid: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        },
        offset: offset,
        limit: limit,
        order: [
            ['name', 'ASC']
        ]
    });
    await updateQuantityOnHand();
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}

export const updateQuantityOnHand = async () => {
    try {
        const items = await Items.findAll({
            attributes: ['iuid','quantityOnHand', 'quantityReceived', 'quantitySold'],
        });

        for (const item of items) {
            const quantityOnHand = item.quantityReceived - item.quantitySold;
            await Items.update({ quantityOnHand: quantityOnHand }, { where: { iuid: item.iuid } });
        }
    } catch (error) {
        console.error(error);
    }
}

    export const getItemsById = async (req, res) => {
        try {
            const items = await Items.findOne({
                where: {
                    iuid: req.params.id
                }
            });
            if (!items) return res.status(404).json({ msg: "Data tidak ditemukan" });
            let response;
            if (req.role === "admin") {
                response = await Items.findOne({
                    where: {
                        id: items.id
                    },
                    include: [{
                        model: User,
                        attributes: ['name', 'email']
                    }]
                });
            } else {
                response = await Items.findOne({
                    attributes: ['iuid', 'name', 'credit'],
                    where: {
                        id: items.id
                    },
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

    export const createItems = async (req, res) => {
        const { iuid, name, debit, credit } = req.body;
        try {
            await Items.create({
                iuid: iuid,
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


    export const updateItems = async (req, res) => {
        try {
            const items = await Items.findOne({
                where: {
                    iuid: req.params.id
                }
            });
            if (!items) return res.status(404).json({ msg: "Data tidak ditemukan" });
            const { iuid, name, credit } = req.body;
            if (req.role === "admin") {
                await items.update({ iuid, name, credit }, {
                    where: {
                        id: items.id
                    }
                });
            }
            res.status(200).json({ msg: "Product updated successfuly" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }

    export const deleteItems = async (req, res) => {
        try {
            const items = await Items.findOne({
                where: {
                    iuid: req.params.id
                }
            });
            if (!items) return res.status(404).json({ msg: "Data tidak ditemukan" });
          //  const { name, price } = req.body;
            if (req.role === "admin") {
                await items.destroy({
                    where: {
                        id: items.id
                    }
                });
            }
            res.status(200).json({ msg: "Product deleted successfuly" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }

