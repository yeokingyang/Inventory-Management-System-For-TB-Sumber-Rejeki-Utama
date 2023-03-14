import Items from "../models/ItemModel.js";
import User from "../models/UserModel.js"
import { Op } from "sequelize"

export const getItems = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = Math.max(limit * page, 0);
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
    try {
        await updateQuantityOnHand();
        res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
}

export const updateQuantityOnHand = async (req, res) => {
    try {
        const items = await Items.findAll({
            attributes: ['iuid', 'quantityOnHand', 'quantityReceived', 'quantitySold'],
        });

        for (const item of items) {
            const quantityOnHand = Math.max(item.quantityReceived - item.quantitySold, 0);
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
    const { iuid, name, credit, type, quantification, explanation } = req.body;
    try {
        await Items.create({
            iuid: iuid,
            name: name,
            credit: credit,
            type: type,
            quantification: quantification,
            explanation: explanation,
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
        const { iuid, name, credit, type, quantification, explanation } = req.body;
        if (req.role === "admin") {
            await items.update({ iuid, name, credit, type, quantification, explanation }, {
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

