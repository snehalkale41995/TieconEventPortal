
export const eventDaysStyleGetter= (date, eventStartDate, eventEndDate) => {
    let calendarDate = new Date(date).setHours(0, 0, 0, 0);
    if (
     eventStartDate <= calendarDate &&
      calendarDate <= eventEndDate
    )
      return {
        className: "special-day",
        style: {
          backgroundColor:
           eventStartDate <= calendarDate &&
            calendarDate <= eventEndDate
              ? "#A0E1B8"
              : "#B2BCC1"
        }
      };
    else
      return {
        style: {
          backgroundColor: "#B2BCC1"
        }
      };
  }

  export const  eventStyleGetter = (event) =>{
    if (event.sessionType === "breakout") var backgroundColor = "#" + "527DDF";
    else if (event.sessionType === "common")
      var backgroundColor = "#" + "AC9723";
    else if (event.sessionType === "keynote")
      var backgroundColor = "#" + "EE6F56";
    else if (event.sessionType === "deepdive")
      var backgroundColor = "#" + "33782E";
    else if(event.sessionType === "panel")
      var backgroundColor = "#" + "A1BCAB";
   else var backgroundColor = "#" + "82D6BE";
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block",
      maxWidth: "100%"
    };
    return {
      style: style
    };
  }