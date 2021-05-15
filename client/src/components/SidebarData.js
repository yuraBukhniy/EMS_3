import React from "react";
//import "./sidebarStyles.css";
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsIcon from '@material-ui/icons/Settings';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

function getSidebarData(role) {
  if(role === "HR") return [
    {
      title: "Проєкти",
      icon: <AccountTreeIcon/>,
      link: "/"
    },
    {
      title: "Кандидати",
      icon: <PeopleOutlineIcon/>,
      link: "/candidates"
    },
    {
      title: "Відпустки",
      icon: <CalendarTodayIcon/>,
      link: "/leave"
    },
    {
      title: "Зарплата",
      icon: <MonetizationOnIcon/>,
      link: "/payment"
    },
    {
      title: "Мій профіль",
      icon: <PersonOutlineIcon/>,
      link: "/user"
    }
  ];
  if(role === "employee") return [
    {
      title: "Мої завдання",
      icon: <FormatListBulletedIcon/>,
      link: "/"
    },
    {
      title: "Відпустки",
      icon: <CalendarTodayIcon/>,
      link: "/leave"
    },
    {
      title: "Зарплата",
      icon: <MonetizationOnIcon/>,
      link: "/payment"
    },
    {
      title: "Тех. підтримка",
      icon: <SettingsIcon/>,
      link: "/service"
    },
    {
      title: "Мій профіль",
      icon: <PersonOutlineIcon/>,
      link: "/user"
    }
  ];
  if(role === "teamLead") return [
    {
      title: "Моя команда",
      icon: <PeopleOutlineIcon/>,
      link: "/"
    },
    {
      title: "Завдання",
      icon: <FormatListBulletedIcon/>,
      link: "/tasks"
    },
    {
      title: "Відпустки",
      icon: <CalendarTodayIcon/>,
      link: "/leave"
    },
    {
      title: "Зарплата",
      icon: <MonetizationOnIcon/>,
      link: "/payment"
    },
    {
      title: "Тех. підтримка",
      icon: <SettingsIcon/>,
      link: "/service"
    },
    {
      title: "Мій профіль",
      icon: <PersonOutlineIcon/>,
      link: "/user"
    },
  ];
  if(role === "manager") return [
    {
      title: "Проєкт",
      icon: <AccountTreeIcon/>,
      link: "/"
    },{
      title: "Моя команда",
      icon: <PeopleOutlineIcon/>,
      link: "/team"
    },
    {
      title: "Завдання",
      icon: <FormatListBulletedIcon/>,
      link: "/tasks"
    },
    {
      title: "Відпустки",
      icon: <CalendarTodayIcon/>,
      link: "/leave"
    },
    {
      title: "Зарплата",
      icon: <MonetizationOnIcon/>,
      link: "/payment"
    },
    {
      title: "Тех. підтримка",
      icon: <SettingsIcon/>,
      link: "/service"
    },
    {
      title: "Мій профіль",
      icon: <PersonOutlineIcon/>,
      link: "/user"
    },
  ];
  if(role === "admin") return [
    {
      title: "Проєкти",
      icon: <AccountTreeIcon/>,
      link: "/"
    },
    {
      title: "Працівники",
      icon: <PeopleOutlineIcon/>,
      link: "/employees"
    },
    {
      title: "Відпустки",
      icon: <CalendarTodayIcon/>,
      link: "/leave"
    },
    {
      title: "Зарплата",
      icon: <MonetizationOnIcon/>,
      link: "/payment"
    },
    {
      title: "Тех. підтримка",
      icon: <SettingsIcon/>,
      link: "/service"
    },
    {
      title: "Мій профіль",
      icon: <PersonOutlineIcon/>,
      link: "/user"
    },
  ];
}

export default getSidebarData;
