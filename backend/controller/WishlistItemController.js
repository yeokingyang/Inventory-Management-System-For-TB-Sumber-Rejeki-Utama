import WishlistItems from "../models/WishlistItemModel.js";
import User from "../models/UserModel.js"
import { Op } from "sequelize"
import path from "path";
import fs from "fs";

export const getWishlistItems = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = Math.max(limit * page, 0);
    const { count, rows } = await WishlistItems.findAndCountAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
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

}

export const getWishlistItemsById = async (req, res) => {

    const wishlistitem = await WishlistItems.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!wishlistitem) return res.status(404).json({ msg: "Data tidak ditemukan" });
    try {
        let response;
        response = await WishlistItems.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });

        res.status(200).json({ result: response, msg: "Data item berhasil diambil" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createWishlistItems = async (req, res) => {
    const { name, credit, type, quantification, explanation } = req.body;
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
            await WishlistItems.create({
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


export const updateWishlistItems = async (req, res) => {
    const wishlistitem = await WishlistItems.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!wishlistitem) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let fileName = "";
    if (req.files === null) {
        fileName = wishlistitem.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${wishlistitem.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const { id, name, credit, type, quantification, explanation } = req.body;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        if (req.role === "admin") {
            await wishlistitem.update({ id, name, image: fileName, url: url, credit, type, quantification, explanation }, {
                where: {
                    id: req.params.id
                }
            });
            return res.status(200).json({ msg: "Item wishlist is updated successfully" });
        }
        res.status(403).json({ msg: "Unauthorized" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteWishlistItems = async (req, res) => {
    const wishlistitem = await WishlistItems.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!wishlistitem) return res.status(404).json({ msg: "Data tidak ditemukan" });
    try {
        //  const { name, price } = req.body;
        if (req.role === "admin") {
            const filepath = `./public/images/${wishlistitem.image}`;
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            await wishlistitem.destroy({
                where: {
                    id: wishlistitem.id
                }
            });
        }
        res.status(200).json({ msg: "Product deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

