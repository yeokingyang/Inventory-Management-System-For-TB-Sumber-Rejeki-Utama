import React from "react";
import {useSelector} from "react-redux";

const Welcome = () => {
  const {user} = useSelector((state) => state.auth) ;
  return (
    <div>
      <h1 className="text-5xl text-white font-bold mb-5" >Dashboard</h1>
      <h2 className="text-3xl text-white mb-10">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
    </div>
  );
};

export default Welcome;
