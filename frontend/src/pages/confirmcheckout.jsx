import React, { useEffect } from "react";
import Checkout from "../components/checkout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";
import Layout from "./layout";


const Confirmcheckout = () => {

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
                <Checkout />
        </Layout>

    );
};

export default Confirmcheckout;
