import React, { useEffect } from 'react'
import Layout from './layout'
import Formaddwishlistitem from '../components/formaddwishlistitem'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";

const Addwishlistitem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);

    return (
        <Layout>
            <Formaddwishlistitem />
        </Layout>
    );
};

export default Addwishlistitem;