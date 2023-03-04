import React, { useEffect } from "react";
import Layout from "./layout";
import SellItemStore from "../components/sellitemstore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";
import SellItemConfirm from "../components/sellitemconfirm";
import {total} from "../features/cartslice"

const Sellitem = () => {
 
  const { isError } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.checkout);
  const { cartItems } = useSelector((state) => state.cart);
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
      <SellItemStore/>
     {isOpen && <SellItemConfirm/>}
  
    </Layout>
  );
};

export default Sellitem;
