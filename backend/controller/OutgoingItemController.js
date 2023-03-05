import OutgoingItems from "../models/OutgoingItemModel.js";
import Items from "../models/ItemModel.js"
import { Sequelize } from "sequelize";
import { Op } from "sequelize"

export const getOutgoingItems = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = Math.max(limit * page, 0);
    const totalRows = await OutgoingItems.count({
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
    const result = await OutgoingItems.findAll({
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
            ['createdAt', 'DESC']
        ]
    });
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}


export const getOutgoingItemsById = async (req, res) => {
    try {
        const OutgoingItem = await OutgoingItems.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!OutgoingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;

        response = await OutgoingItems.findOne({
            where: {
                id: OutgoingItem.id
            }
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const createOutgoingItems = async (req, res) => {
    const { iuid, quantitySold } = req.body;
    try {
        const Item = await Items.findOne({ where: { iuid: iuid } });
        if (!Item) {
            return res.status(404).json({ msg: "Item not found" });
        }
        await OutgoingItems.create({
            iuid: Item.iuid,
            name: Item.name,
            credit: Item.credit,
            quantitySold: quantitySold,
            totalCredit: Item.credit * quantitySold
        });
        await updateQuantitySold(iuid);
        res.status(201).json({ msg: "Item purchased created successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateOutgoingItems = async (req, res) => {
    try {
        const OutgoingItem = await OutgoingItems.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!OutgoingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        const { credit, quantitySold } = req.body;
        const totalCredit = credit * quantitySold;
        if (req.role === "admin") {
            await OutgoingItem.update({ credit, quantitySold, totalCredit }, {
                where: {
                    id: OutgoingItem.id
                }
            });
        }
        await updateQuantitySold(OutgoingItem.iuid);
        res.status(200).json({ msg: "Product updated successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const deleteOutgoingItems = async (req, res) => {
    try {
        const OutgoingItem = await OutgoingItems.findOne({
            where: {
                id: req.params.id
            }
        });
        const prevIuid = OutgoingItem.iuid;
        if (!OutgoingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        if (req.role === "admin") {
            await OutgoingItem.destroy({
                where: {
                    id: OutgoingItem.id
                }
            });
        }
        await updateQuantitySold(prevIuid);
        res.status(200).json({ msg: "Product deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const updateQuantitySold = async (iuid) => {
    try {
        const result = await OutgoingItems.findOne({
            attributes: [
                'iuid',
                [Sequelize.fn('SUM', Sequelize.col('quantitySold')), 'totalQuantity']
            ],
            where: { iuid: iuid },
            group: ['iuid']
        });

        if (!result || !result.dataValues.totalQuantity) {
            const totalQuantity = 0;
            await Items.update({ quantitySold: totalQuantity }, { where: { iuid: iuid } });
        }
        else {
            const totalQuantity = result.dataValues.totalQuantity;
            await Items.update({ quantitySold: totalQuantity }, { where: { iuid: iuid } });
        }

    } catch (error) {
        console.error(error);
    }
};

