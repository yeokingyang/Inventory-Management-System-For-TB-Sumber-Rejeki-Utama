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
    const { iuid, quantitySold, credit, quantification, date } = req.body;
    const totalCredit = credit * quantitySold;
    const Item = await Items.findOne({ where: { iuid: iuid } });
    const currentDate = new Date();
    const year = date.slice(0, 4);
    const month = date.slice(5, 7) - 1; // subtract 1 from month since it's zero-indexed in Date constructor
    const day = date.slice(8, 10);
    const combinedDate = new Date(year, month, day, currentDate.getHours() + 8, currentDate.getMinutes(), currentDate.getSeconds());
    if (!Item) {
        return res.status(404).json({ msg: "Item not found" });
    }
    try {
        await OutgoingItems.create({
            iuid: Item.iuid,
            name: Item.name,
            credit: credit,
            type: Item.type,
            quantification: quantification,
            quantitySold: quantitySold,
            totalCredit: totalCredit,
            date: combinedDate
        });
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
        const { credit, quantitySold, quantification, explanation } = req.body;
        const totalCredit = credit * quantitySold;
        if (req.role === "admin") {
            await OutgoingItem.update({ credit, quantitySold, totalCredit, quantification, explanation }, {
                where: {
                    id: OutgoingItem.id
                }
            });
        }
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
        if (!OutgoingItem) return res.status(404).json({ msg: "Data tidak ditemukan" });
        if (req.role === "admin") {
            await OutgoingItem.destroy({
                where: {
                    id: OutgoingItem.id
                }
            });
        }
        res.status(200).json({ msg: "Product deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateQuantitySold = async (req, res) => {

    const { iuid } = req.body;
    const result = await OutgoingItems.findOne({
        attributes: [
            'iuid',
            [Sequelize.fn('SUM', Sequelize.col('quantitySold')), 'totalQuantity']
        ],
        where: { iuid: iuid },
        group: ['iuid']
    });
    if (!result) {
        try {
            await Items.update({ quantitySold: 0 }, { where: { iuid: iuid } });
            return res.status(200).json({ msg: "Quantitysold updated successfully" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    } else {
        const totalQuantity = result.dataValues.totalQuantity || 0;
        try {
            await Items.update({ quantitySold: totalQuantity }, { where: { iuid: iuid } });
            return res.status(200).json({ msg: "Quantitysold updated successfully" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};


/*export const updateQuantitySold = async (req, res) => {

    const { iuid } = req.body;
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
*/
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

export const getThisMonthIncome = async (req, res) => {
    try {
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth());

        let data = await OutgoingItems.sum('totalCredit', {
            where: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%Y-%m'), '=', Sequelize.fn('DATE_FORMAT', thisMonth, '%Y-%m')),
        });
        if (data == null) {
            data = 0
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getThisMonthVsLastMonthIncome = async (req, res) => {
    try {
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth());

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const thisMonthTotal = await OutgoingItems.sum('totalCredit', {
            where: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%Y-%m'), '=', Sequelize.fn('DATE_FORMAT', thisMonth, '%Y-%m')),
        });

        const lastMonthTotal = await OutgoingItems.sum('totalCredit', {
            where: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('date'), '%Y-%m'), '=', Sequelize.fn('DATE_FORMAT', lastMonth, '%Y-%m')),
        });

        const percentageDiff = (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(2);

        const isIncrease = percentageDiff > 0;

        res.status(200).json({
            thisMonthTotal: thisMonthTotal,
            lastMonthTotal: lastMonthTotal,
            percentageDiff: percentageDiff,
            isIncrease: isIncrease
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getIncomeChart = async (req, res) => {
    try {
        const aYearAgo = new Date();
        aYearAgo.setMonth(aYearAgo.getMonth() - 5);

        const incomeData = await OutgoingItems.findAll({
            attributes: [
                'date',
                [Sequelize.fn('SUM', Sequelize.col('totalCredit')), 'totalIncome']
            ],
            where: {
                date: {
                    [Op.gte]: aYearAgo
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('date'))],
            raw: true
        });
        const sortedIncomeData = incomeData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const yearDiff = dateA.getFullYear() - dateB.getFullYear();
            const monthDiff = dateA.getMonth() - dateB.getMonth();
            return yearDiff !== 0 ? yearDiff : monthDiff;
        });
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = sortedIncomeData.reduce((acc, { date, totalIncome }) => {
            const month = new Date(date).getMonth();
            const monthName = monthNames[month];
            acc[monthName] = totalIncome;
            return acc;
        }, {});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getIncometoForecast = async (req, res) => {
    try {
        const currentDate = new Date();
        const sevenMonthsAgo = new Date(currentDate);
        sevenMonthsAgo.setMonth(currentDate.getMonth() - 7);

        const data = await OutgoingItems.findAll({
            attributes: [
                'date',
                [Sequelize.fn('SUM', Sequelize.col('totalCredit')), 'totalIncome']
            ],
            where: {
                date: {
                    [Op.gte]: sevenMonthsAgo
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('date'))],
            raw: true
        });

        // Get the current month an Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),      and: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),    });d year
        const currentMonth = currentDate.getMonth() + 1; // Months in JavaScript are 0-indexed, so add 1
        const currentYear = currentDate.getFullYear();

        // Find the index of the newest month's data
        let newestMonthIndex = -1;
        data.forEach((item, index) => {
            const month = new Date(item.date).getMonth() + 1;
            const year = new Date(item.date).getFullYear();
            if (month === currentMonth && year === currentYear) {
                newestMonthIndex = index;
            }
        });

        // If the newest month's data is found, remove it from the data array
        if (newestMonthIndex !== -1) {
            data.splice(newestMonthIndex, 1);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getReportIncomebyDaily = async (req, res) => {
    try {
        const { month, year } = req.query;

        const formattedMonth = month.padStart(2, '0');
        const formattedYear = year;

         // Query outgoing items based on year and month
         const data = await OutgoingItems.findAll({
            where: {
                date: {
                    [Sequelize.Op.and]: [
                        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), formattedYear),
                        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), formattedMonth),
                    ],
                },
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('date')), 'date'], // Extract only the date part
                [Sequelize.fn('SUM', Sequelize.col('totalCredit')), 'totalIncome'], // Sum of the income column
            ],
            group: [Sequelize.fn('DATE', Sequelize.col('date'))], // Group by date part
            raw: true, // Return raw data
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};