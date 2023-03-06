import React, { useEffect } from 'react'
import Layout from './layout'
import Formeditoutgoingitem from '../components/formeditoutgoingitem'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";

const Editoutgoingitem = () => {
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
            <Formeditoutgoingitem />
        </Layout>
    );
};

export default Editoutgoingitem;