import React, { useEffect, useState } from "react";
import { BiShoppingBag } from "react-icons/bi";
import axios from "axios";
import Purchaseitemslist from "./purchaseitemlist";
import { open } from "../features/checkoutslice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Purchaseitemstore = () => {

    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        getItems();

    }, [page, keyword]);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 20);
        });
    }, []);

    const getItems = async () => {
        const response = await axios.get(
            `http://localhost:5000/items?search_query=${keyword}&page=${page}&limit=${limit}`
        );
        setItems(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };


    return (
        <div
        className={`${
          scroll ? "bg-grey shadow-lg" : ""
        } overflow-y-auto h-screen"`}
      >
            <div className="fixed top-32 right-0 p-4">
                <div className="relative cursor-pointer"
                    onClick={() => dispatch(open())} >
                    <BiShoppingBag className="text-3xl opacity-80 text-white" />
                    <div className="absolute w-4 h-4 rounded-full z-10 right-[-3px] bottom-[-3px] flex items-center justify-center text-[10px] bg-black text-white">
                        0
                    </div>
                </div>
            </div>
            <div className="section mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
                {items.map((item) => {
                    return <Purchaseitemslist key={item.iuid} item={item} />;
                })}
            </div>
        </div>
    );
};

export default Purchaseitemstore;