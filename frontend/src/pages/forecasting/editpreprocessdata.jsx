import React, { useEffect } from 'react'
import Layout from '.././layout'
import Preprocessdata from '../../components/forecasting/preprocessdata'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authslice";

const Editpreprocessdata = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
        if (user && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [isError, user, navigate]);

    return (
        <Layout>
            <Preprocessdata />
        </Layout>
    );
};

export default Editpreprocessdata;