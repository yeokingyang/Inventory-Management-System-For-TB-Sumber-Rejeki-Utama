import Items from "../models/ItemModel.js";
import IncomingItems from "../models/IncomingItemModel.js"
import OutgoingItems from "../models/OutgoingItemModel.js"
import User from "../models/UserModel.js"
import { Op } from "sequelize"
import path from "path";
import fs from "fs";

export const getItems = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = Math.max(limit * page, 0);
    const orderBy = req.query.orderBy || "name";
    const orderType = req.query.orderType || "asc";
    const order = [[orderBy, orderType.toUpperCase()]];

    const { count, rows } = await Items.findAndCountAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
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
            [order]
        ]
    });
    const totalPage = Math.ceil(count / limit);
    try {
        res.status(200).json({
            result: rows,
            page: page,
            limit: limit,
            totalRows: count,
            totalPage: totalPage,
            msg: "berhasil mengambil data item"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }



    /*   const page = parseInt(req.query.page) || 0;
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
       }*/


}

export const updateQuantityOnHand = async (req, res) => {
    const iuidToUpdate = req.body.iuid;
    const item = await Items.findOne({
        attributes: ['iuid', 'quantityOnHand', 'quantityReceived', 'quantitySold'],
        where: {
            iuid: iuidToUpdate
        }
    });
    if (!item) return res.status(404).json({ msg: "Data tidak ditemukan" });
    try {

        const quantityOnHand = Math.max(item.quantityReceived - item.quantitySold, 0);
        await Items.update({ quantityOnHand: quantityOnHand }, { where: { iuid: iuidToUpdate } });

        res.status(200).json({ msg: "quantityonhand berhasil diupdate" });

    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getItemsById = async (req, res) => {

    const items = await Items.findOne({
        where: {
            iuid: req.params.iuid
        }
    });
    if (!items) return res.status(404).json({ msg: "Data tidak ditemukan" });
    try {
        let response;
        response = await Items.findOne({
            where: {
                iuid: req.params.iuid
            }
        });

        res.status(200).json({ result: response, msg: "Data item berhasil diambil" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createItems = async (req, res) => {
    const { iuid, name, credit, type, quantification, explanation } = req.body;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];
    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Items.create({
                iuid: iuid,
                name: name,
                image: fileName,
                url: url,
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
    })
}


export const updateItems = async (req, res) => {
    const items = await Items.findOne({
        where: {
            iuid: req.params.iuid
        }
    });
    if (!items) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let fileName = "";
    if (req.files === null) {
        fileName = items.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const randomName = `${Date.now()}-${Math.round(Math.random() * 100000)}`
        fileName = `${randomName}${ext}`;
     //   fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${items.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    
        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const { name, credit, type, quantification, explanation } = req.body;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        if (req.role === "admin") {
            await items.update({  name, image: fileName, url: url, credit, type, quantification, explanation }, {
                where: {
                    iuid: req.params.iuid
                }
            });
            const incomingItemsUpdated = await IncomingItems.update(
                {   
                   
                    name: name,
                    type: type,
                 //   quantification: quantification
                },
                { where: { iuid: req.params.iuid }}
            );

            const outgoingItemsUpdated = await OutgoingItems.update(
                {
                     
                     name: name,
                     type: type,
                   //  quantification: quantification 
                },
                { where: { iuid: req.params.iuid } }
            );

            // Check if child items were updated
            if (incomingItemsUpdated[0] === 0 && outgoingItemsUpdated[0] === 0) {
                return res.status(200).json({ msg: "Item updated, but child items not found" });
            } else {
                return res.status(200).json({ msg: "Item and child items updated successfully" });
            }

        }
        res.status(403).json({ msg: "Unauthorized" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteItems = async (req, res) => {
    const item = await Items.findOne({
        where: {
            iuid: req.params.iuid
        }
    });
    if (!item) return res.status(404).json({ msg: "Data tidak ditemukan" });
    try {
        //  const { name, price } = req.body;
        if (req.role === "admin") {
            const filepath = `./public/images/${item.image}`;
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            await item.destroy({
                where: {
                    iuid: item.iuid
                }
            });
        }
        res.status(200).json({ msg: "Product deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const countItems = async (req, res) => {
    try {
      const count = await Items.count();
      res.json({ result: count });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };


