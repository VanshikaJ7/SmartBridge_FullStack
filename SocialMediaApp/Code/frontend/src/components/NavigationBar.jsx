import "../Styling/navigation.css";
import React, { useContext } from "react";
import { BiHomeAlt } from "react-icons/bi";
import { BsChatSquareText } from "react-icons/bs";
import { CgAddR } from "react-icons/cg";
import { TbNotification } from "react-icons/tb";
import { GeneralContext } from "../context/GeneralContextProvider";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const { isCreatePostOpen, setIsCreatePostOpen, setIsCreateStoryOpen, isNotificationsOpen, setNotificationsOpen } = useContext(GeneralContext);
  const navigate = useNavigate();
  const Profile = localStorage.getItem('profilePic');
  const userId = localStorage.getItem('userId');

  return (
    <div className="Navbar">
      <BiHomeAlt className="homebtn btns" onClick={() => navigate('/pages/Home')} />
      <BsChatSquareText className="chatbtn btns" onClick={() => navigate('/chat')} />
      <CgAddR className="createPostbtn btns" onClick={() => { setIsCreatePostOpen(!isCreatePostOpen); setIsCreateStoryOpen(false); }} />
      <TbNotification className="Notifybtn btns" onClick={() => setNotificationsOpen(!isNotificationsOpen)} />
      <img className="profile" src={Profile} alt="" onClick={() => navigate(`/profile/${userId}`)} />
    </div>
  );
};

export default NavigationBar;
