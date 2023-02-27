import React, {useEffect} from 'react'
import Layout from './layout'
import Formedituser from '../components/formedituser'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authslice";

const Edituser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user  } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if(user && user.role !== "admin"){
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
        <Formedituser/>
    </Layout>
  );
};

export default Edituser;