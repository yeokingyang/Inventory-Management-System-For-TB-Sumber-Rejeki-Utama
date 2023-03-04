import IncomingItems from "../models/IncomingItemModel.js";
import Items from "../models/ItemModel.js"
import { Sequelize } from "sequelize";

export const getIncomingItems = async (req, res) => {
    try {
        const response = await IncomingItems.findAll({
            include: [{
                model: Items,
                attributes: ['iuid', 'name']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getIncomingItemsById = async (req, res) => {
    try {
        const IncomingItem = await IncomingItems.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!IncomingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;

        response = await IncomingItems.findOne({
            where: {
                id: IncomingItem.id
            },
            include: [{
                model: Items,
                attributes: ['iuid', 'name']
            }]
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const createIncomingItems = async (req, res) => {
    const { iuid, debit, quantityPurchased } = req.body;
    const totalDebit = debit * quantityPurchased;
    try {
        const Item = await Items.findOne({ where: { iuid: iuid } });
        if (!Item) {
            return res.status(404).json({ msg: "Item not found" });
        }
        await IncomingItems.create({
            iuid: Item.iuid,
            name: Item.name,
            debit: debit,
            totalDebit: totalDebit,
            quantityPurchased: quantityPurchased
        });
        await updateQuantityReceived(iuid);
        res.status(201).json({ msg: "Item purchased created successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateIncomingItems = async (req, res) => {
    try {
        const IncomingItem = await IncomingItems.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!IncomingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        const {  iuid, debit, quantityPurchased } = req.body;
        const totalDebit = debit * quantityPurchased; 
        if (req.role === "admin") {
            await IncomingItem.update({  debit, quantityPurchased, totalDebit }, {
                where: {
                    id: IncomingItem.id
                }
            });
        }
        await updateQuantityReceived(IncomingItem.iuid);
        res.status(200).json({ msg: "Product updated successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteIncomingItems = async (req, res) => {
    try {
        const IncomingItem = await IncomingItems.findOne({
            where: {
                id: req.params.id
            }
        });
        const prevIuid = IncomingItem.iuid; 
        if (!IncomingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        const { iuid } = req.body;
        if (req.role === "admin") {
            await IncomingItem.destroy({
                where: {
                    id: IncomingItem.id
                }
            });
        }
        await updateQuantityReceived(prevIuid);
        res.status(200).json({ msg: "Product deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const updateQuantityReceived = async (iuid) => {
    try {

        const result = await IncomingItems.findOne({
            attributes: [
                'iuid',
                [Sequelize.fn('SUM', Sequelize.col('quantityPurchased')), 'totalQuantity']
            ],
            where: { iuid: iuid },
            group: ['iuid']
        });

        if (!result || !result.dataValues.totalQuantity) {
            const totalQuantity = 0;
            await Items.update({ quantityReceived: totalQuantity }, { where: { iuid: iuid } });
        }
        else {
            const totalQuantity = result.dataValues.totalQuantity;
            await Items.update({ quantityReceived: totalQuantity }, { where: { iuid: iuid } });
        }

    } catch (error) {
        console.error(error);
    }
};

