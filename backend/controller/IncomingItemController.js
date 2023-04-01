import IncomingItems from "../models/IncomingItemModel.js";
import Items from "../models/ItemModel.js"
import { Sequelize } from "sequelize";
import { Op } from "sequelize";

export const getIncomingItems = async (req, res) => {
    /*  const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = Math.max(limit * page, 0);
      const totalRows = await IncomingItems.count({
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
      const result = await IncomingItems.findAll({
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
    const { count, rows } = await IncomingItems.findAndCountAll({
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
            ['date', 'DESC']
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
            msg: "data berhasil di ambil"
        });
    } catch (error) {
        console.error(error);
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
    const { iuid, debit, quantityPurchased, date } = req.body;
    const totalDebit = debit * quantityPurchased;
    try {
        const Item = await Items.findOne({ where: { iuid: iuid } });
        if (!Item) {
            return res.status(404).json({ msg: "Item not found" });
        }
        await IncomingItems.create({
            iuid: Item.iuid,
            name: Item.name,
            type: Item.type,
            quantification: Item.quantification,
            debit: debit,
            totalDebit: totalDebit,
            quantityPurchased: quantityPurchased,
            date: date
        });
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
        const { iuid, debit, quantification, quantityPurchased } = req.body;
        const totalDebit = debit * quantityPurchased;
        if (req.role === "admin") {
            await IncomingItem.update({ debit, quantityPurchased, quantification, totalDebit }, {
                where: {
                    id: IncomingItem.id
                }
            });
        }
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
        if (!IncomingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        const { iuid } = req.body;
        if (req.role === "admin") {
            await IncomingItem.destroy({
                where: {
                    id: IncomingItem.id
                }
            });
        }
        res.status(200).json({ msg: "Product deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const updateQuantityReceived = async (req, res) => {
    const { iuid } = req.body;
    const result = await IncomingItems.findOne({
        attributes: [
            'iuid',
            [Sequelize.fn('SUM', Sequelize.col('quantityPurchased')), 'totalQuantity']
        ],
        where: { iuid: iuid },
        group: ['iuid']
    });
    if (!result) {
        try {
            await Items.update({ quantityReceived: 0 }, { where: { iuid: iuid } });
            return res.status(200).json({ msg: "quantityReceived updated successfully" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
    else {
        const totalQuantity = result.dataValues.totalQuantity || 0;
        try {
            await Items.update({ quantityReceived: totalQuantity }, { where: { iuid: iuid } });
            return res.status(200).json({ msg: "Quantityreceived updated successfully" });

        } catch (error) {
            res.status(500).json({ msg: error.message });
        }

    }

};

