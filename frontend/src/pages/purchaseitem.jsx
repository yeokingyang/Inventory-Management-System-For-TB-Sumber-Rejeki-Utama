import React, { useEffect } from "react";
import Layout from "./layout";
import Purchaseitemstore from "../components/purchaseitemstore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";
import PurchaseItemConfirm from "../components/purchaseitemconfirm";
import {total} from "../features/cartslice"

const Purchaseitem = () => {
 
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
      <Purchaseitemstore/>
     {isOpen && <PurchaseItemConfirm/>}
  
    </Layout>
  );
};

export default Purchaseitem;
