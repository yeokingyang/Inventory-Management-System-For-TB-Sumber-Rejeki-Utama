import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authslice";

const Sidebar = () => {
  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "User", link: "/users", icon: AiOutlineUser },
    { name: "Items", link: "/items", icon: IoPricetag },
    { name: "Wishlist Items", link: "/wishlistitems", icon: IoPricetag },
    { name: "Incoming Items", link: "/incomingitems", icon: TbReportAnalytics, margin: true },
    { name: "Stocking Items", link: "/stockitem", icon: FiFolder },
    { name: "Outgoing Items", link: "/outgoingitems", icon: FiFolder, margin: true},
    { name: "Sell Items", link: "/sellitem", icon: FiShoppingCart },
    { name: "analytics", link: "/analytics", icon: TbReportAnalytics, margin: true },
    { name: "Saved", link: "/", icon: AiOutlineHeart},
    { name: "LogOut", link:"/", icon: RiSettings4Line },
  ];

  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <section className="flex gap-6 z-20">
      <div
        className={`bg-[#0e0e0e] min-h-screen ${open ? "w-72" : "w-16"
          } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (

            (menu?.name === "user" && !isAdmin) ? null : (
              <Link
                to={menu?.link}
                key={i}
                onClick={menu?.name === "LogOut" ? logout : null}
                className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md ${menu?.margin && "mt-5"
                  }`}
              >
                <div className={`${!open && "pr-2"} ${open ? "w-8" : "w-0"} transition-all duration-500`}>
                  {React.createElement(menu?.icon, { size: "20" })}
                </div>
                <h2
                  style={{
                    transitionDelay: `${i + 3}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                >
                  {menu?.name}
                </h2>
                <h2
                  className={`${open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  {menu?.name}
                </h2>
              </Link>
            )
          ))}
        </div>
      </div>
    </section>

  );
};

export default Sidebar;