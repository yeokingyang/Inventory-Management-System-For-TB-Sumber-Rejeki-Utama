import React, { useEffect } from "react";
import Layout from "./layout";
import Outgoingitemlist from "../components/outgoingitemlist";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";

const Outgoingitems = () => {
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
      <Outgoingitemlist/>
    </Layout>
  );
};

export default Outgoingitems;
