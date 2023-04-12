import React, { useEffect } from 'react'
import Layout from '.././layout'
import Modelpredict from '../../components/forecasting/modelpredict'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authslice";

const Editpreprocessdata = () => {
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
            <Modelpredict />
        </Layout>
    );
};

export default Editpreprocessdata;