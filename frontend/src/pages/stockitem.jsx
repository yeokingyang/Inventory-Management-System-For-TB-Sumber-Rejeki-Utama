import React, { useEffect } from "react";
import Layout from "./layout";
import StockItemStore from "../components/stockitemstore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";
import StockItemConfirm from "../components/stockitemconfirm";
import {total} from "../features/stockslice"

const Sellitem = () => {
 
  const { isError } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.checkin);
  const { cartItems } = useSelector((state) => state.stockcart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
   dispatch(total());
  }, [cartItems]);


  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <StockItemStore/>
     {isOpen && <StockItemConfirm/>}
  
    </Layout>
  );
};

export default Sellitem;
