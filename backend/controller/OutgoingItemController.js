import OutgoingItems from "../models/OutgoingItemModel.js";
import Items from "../models/ItemModel.js"
import { Sequelize } from "sequelize";
import { Op } from "sequelize"

export const getOutgoingItems = async (req, res) => {
    /*  const page = parseInt(req.query.page) || 0;
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
      try {
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
      }*/

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = Math.max(limit * page, 0);
    const { count, rows } = await OutgoingItems.findAndCountAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: search + '%'
                }
            }, {
                iuid: {
                    [Op.like]: search + '%'
                }
            }]
        },
        offset: offset,
        limit: limit,
        order: [
            ['name', 'ASC']
        ]
    });
    const totalPage = Math.ceil(count / limit);
    try {
        res.json({
            result: rows,
            page: page,
            limit: limit,
            totalRows: count,
            totalPage: totalPage,
            msg: "data outgoingitem berhasil diambil"
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
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
    const { iuid, quantitySold, date } = req.body;
    try {
        const Item = await Items.findOne({ where: { iuid: iuid } });
        if (!Item) {
            return res.status(404).json({ msg: "Item not found" });
        }
        await OutgoingItems.create({
            iuid: Item.iuid,
            name: Item.name,
            credit: Item.credit,
            type: Item.type,
            quantification: Item.quantification,
            quantitySold: quantitySold,
            totalCredit: Item.credit * quantitySold,
            date: date
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


export const updateQuantitySold = async (iuid, res) => {
    const result = await OutgoingItems.findOne({
        attributes: [
            'iuid',
            [Sequelize.fn('SUM', Sequelize.col('quantitySold')), 'totalQuantity']
        ],
        where: { iuid: iuid },
        group: ['iuid']
    });
    if (!result) return res.status(404).json({ msg: "Data diupdatequantity sold tidak ditemukan" });
    try {
        if (!result || !result.dataValues.totalQuantity) {
            const totalQuantity = 0;
            await Items.update({ quantitySold: totalQuantity }, { where: { iuid: iuid } });
        }
        else {
            const totalQuantity = result.dataValues.totalQuantity;
            await Items.update({ quantitySold: totalQuantity }, { where: { iuid: iuid } });
        }
        return res.status(200).json({ msg: "Quantitysold updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

//use by dashboard webpage to get total laba kotor
export const getOutgoingItemsSumTotalCredit = async (req, res) => {
    try {
        const result = await OutgoingItems.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('totalCredit')), 'sumTotalCredit']
            ],
            raw: true
        });

        if (!result || !result[0].sumTotalCredit) {
            const sumTotalCredit = 0;
            return res.json({ result: sumTotalCredit });
        } else {
            const sumTotalCredit = result[0].sumTotalCredit;
            return res.json({ result: sumTotalCredit });
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
};
