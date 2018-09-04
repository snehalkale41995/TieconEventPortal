export default {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "fa fa-dashcube"
    },
    {
      name: "Events",
      url: "/events",
      icon: "icon-calendar"
    },
    {
      name: "Rooms",
      url: "/roomsList",
      icon: "icon-home"
    },
    {
      name: "Sessions",
      url: "/sessions",
      icon: "icon-calendar"
    },
    {
      name: "Attendees",
      url: "/registrationList",
      icon: "icon-user"
    },
    {
      name: "Speakers",
      url: "/speakers",
      icon: "icon-microphone"
    },
    {
      name: "Attendance",
      url: "/attendance",
      icon: "fa fa-thumb-tack"
    },

    {
      name: "Sponsors",
      url: "/sponsors",
      icon: "fa fa-money"
    },
    {
      name: "Dynamic Forms",
      url: "/dynamicForms",
      icon: "fa fa-file-text"
    },
    {
      name: "Reports ",
      url: "/reports/",
      icon: "icon-chart",
      children: [
        {
          name: "Event Reports",
          url: "/reports/eventReports",
          icon: "icon-chart"
        },
        {
          name: "Session Reports",
          url: "/reports/sessionReports",
          icon: "icon-chart"
        },
        {
          name: "Attendee Reports",
          url: "/reports/attendeeReports",
          icon: "icon-chart"
        }
      ]
    },
    {
      name: "Static Pages",
      url: "/staticPages/",
      icon: "fa fa-file",
      children: [
        {
          name: "About Us",
          url: "/staticPages/aboutUs",
          icon: "icon-info"
        },
        {
          name: "About Eternus",
          url: "/staticPages/aboutEternus",
          icon: "icon-info"
        },
        {
          name: "Help Desk",
          url: "/staticPages/helpDesk",
          icon: "icon-phone"
        },
        {
          name: "Event Location",
          url: "/staticPages/eventLocation",
          icon: "icon-compass"
        }
      ]
    },
    {
      name: "Logout",
      url: "/logout",
      icon: "fa fa-sign-out"
    }
  ]
};
