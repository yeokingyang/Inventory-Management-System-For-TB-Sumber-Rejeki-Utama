import ItemsPurchased from "../models/ItemPurchasedModel.js";
import Items from "../models/ItemModel.js"
import { Sequelize } from "sequelize";

export const getItemsPurchased = async (req, res) => {
    try {
        const response = await ItemsPurchased.findAll({
            include: [{
                model: Item,
                attributes: ['iuid', 'name']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getItemsPurchasedById = async (req, res) => {
    try {
        const ItemsPurchased = await ItemsPurchased.findOne({
            where: {
                iuid: req.params.id
            }
        });
        if (!ItemsPurchased) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;

        response = await ItemsPurchased.findOne({
            where: {
                id: ItemsPurchased.id
            },
            include: [{
                model: Item,
                attributes: ['iuid', 'name']
            }]
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const createItemsPurchased = async (req, res) => {
    const { iuid, debit, quantityPurchased } = req.body;
    const totalDebit = debit * quantityPurchased;
    try {
        const Item = await Items.findOne({ where: { iuid: iuid } });
        if (!Item) {
            return res.status(404).json({ msg: "Item not found" });
        }
        await ItemsPurchased.create({
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

export const updateQuantityReceived = async (iuid) => {
    try {
        const result = await ItemsPurchased.findOne({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('quantityPurchased')), 'totalQuantity']],
            where: { iuid: iuid }
        });

        if (!result || !result.dataValues.totalQuantity) {
            return;
        }

        const totalQuantity = result.dataValues.totalQuantity;
        await Items.update({ quantityReceived: totalQuantity }, { where: { iuid: iuid } });
    } catch (error) {
        console.error(error);
    }
};

