import QRCode from "qrcode";

// Method for print ID card // Not in use
export const openWin = (user, generatedQR) => {
  let briefInfo;
  let userName = user.firstName + " " + user.lastName;
  let CompanyName = "";
  let attendeeLabel = "";
  let attendeeCount = "";
  let attendeeCode = "";
  if (user.attendeeLabel) attendeeLabel = user.attendeeLabel;
  if (user.attendeeCount) attendeeCount = user.attendeeCount;
  attendeeCode = attendeeLabel + "-" + attendeeCount;
  if (user.briefInfo != undefined) {
    briefInfo = user.briefInfo;
    CompanyName = briefInfo.split("\n")[0];
  } else {
    CompanyName = "";
  }

  let newWindow = window.open("", "", "width=1000,height=1000");
  setTimeout(() => (newWindow.document.title = "" + attendeeCode + ""), 0);
  newWindow.document.writeln("<html>");
  newWindow.document.writeln("<body>");
  newWindow.document.write(
    "<div style='width:4in;height:5in;text-align:center;margin-left:0;margin-top:0;'>"
  );
  newWindow.document.write("<div style='height:100%;'>");
  //layer1
  newWindow.document.write("<div style='height:29%;'> </div>");
  //layer2
  newWindow.document.write(
    "<div style='margin-top:30px;padding: 0 30px;max-height:150px;height:150px;margin-left:-15px;'><h1 style='font-size: 2.2rem;font-family:'Arial';padding: 10px 0 0 0;margin-top:40px;margin-bottom:-10px;'>" +
      userName +
      "</h1>"
  );
  newWindow.document.write(
    "<p style='margin-top:-16px;font-size: 1.5rem;font-family:'Avenir-Book';'>" +
      CompanyName +
      "</p>"
  );
  //newWindow.document.write("<p style='margin-top:-16px;font-size: 1.5rem;font-family:'Avenir-Book';'>MarketAxis Consulting</p>")
  newWindow.document.write("</div>");
  //layer2a
  newWindow.document.write(
    "<div style='text-align: left;padding: 30px 30px;padding-bottom:0;margin-top:-20px;position:fixed;'>"
  );
  newWindow.document.write(
    "<img style='width:90px;height:90px;margin-left:-14px;margin-bottom:-4px;' src='" +
      generatedQR +
      "'/>"
  );
  newWindow.document.write(
    "<div style='text-align:left;font-weight:bold;font-size:13px;font-family:'Arial';margin-top:-4px;padding: 0 0px;padding-right:0px;padding-left:50px;'>" +
      attendeeCode +
      "</div> <br/>"
  );
  newWindow.document.write("</div>");
  //layer3
  newWindow.document.write(
    "<div style='border-left:1px solid #666;border-right:1px solid #666;'>"
  );
  newWindow.document.write("</div>");
  newWindow.document.write("</div>");
  newWindow.document.write("</div>");
  newWindow.document.writeln("</body></html>");
  newWindow.document.close();

  setTimeout(function() {
    newWindow.print();
    newWindow.close();
  }, 500);
};

// Method for generate QR code
export const onGenerateQRcode = user => {
  let generatedQR;
  let id = user._id;
  let userName = user.firstName + " " + user.lastName;
  let Label = user.attendeeLabel;
  let Count = user.attendeeCount;
  let AttendeeCode = Label + "-" + Count;
  QRCode.toDataURL("TIE" + ":" + AttendeeCode + ":" + id + ":" + userName).then(
    url => {
      generatedQR = url;
      setTimeout(() => {
        // openWin(user, generatedQR);
        generatePdfSingle(user, generatedQR);
      }, 250);
    }
  );
};

export const generateQRcodeBulk = (userCollection, eventName, profileName) => {
  userCollection.forEach(user => {
    let id = user.userInfo._id;
    let Label = user.userInfo.attendeeLabel;
    let Count = user.userInfo.attendeeCount;
    let AttendeeCode = Label + "-" + Count;
    QRCode.toDataURL("TIE" + ":" + AttendeeCode + ":" + id).then(url => {
      user.userInfo["qrCode"] = url;
    });
  });
  setTimeout(() => {
    generatePdfBulk(userCollection, eventName, profileName);
  }, 250);
};

export const generatePdfBulk = (userCollection, eventName, profileName) => {
  if (eventName == null) eventName = "";
  if (profileName == null) profileName = "";
  let jsPDF = require("jspdf");
  let doc = new jsPDF();
  //var doc = new jsPDF('p', 'pt', 'c6');
  userCollection.forEach(user => {
    let Label = user.userInfo.attendeeLabel;
    let fullName = user.userInfo.firstName + " " + user.userInfo.lastName;
    let Count = user.userInfo.attendeeCount;
    let briefInfo = user.userInfo.briefInfo;
    let imgData = user.userInfo.qrCode;
    let attendeeCode = Label + "-" + Count;

    doc.addPage();
    doc.setFontSize(30); //size in px
    let name = doc.splitTextToSize(fullName, 100);
    doc.text(50, 55, name, "center" || ""); // x axis , y axis in mm
    if (name.length == 1) {
      doc.setFontSize(20);
      let info = doc.splitTextToSize(briefInfo, 80);
      doc.text(50, 65, info, "center" || "");
    }
    if (name.length == 2) {
      doc.setFontSize(20);
      let info = doc.splitTextToSize(briefInfo, 80);
      doc.text(50, 78, info, "center" || "");
    }
    doc.addImage(imgData, "JPEG", 10, 95, 20, 20); // x , y , height, width in mm
    doc.setFontSize(10);
    doc.text(12, 117, attendeeCode || "");
  });
  doc.save(eventName + " " + profileName + ".pdf");
};

export const generatePdfSingle = (user, generatedQR) => {
  var jsPDF = require("jspdf");
  var doc = new jsPDF();
  //var doc = new jsPDF('p', 'pt', 'c6');
  let fullName = user.firstName + " " + user.lastName;
  let briefInfo = user.briefInfo;
  let imgData = generatedQR;
  let attendeeCode = user.attendeeLabel + "-" + user.attendeeCount;
  doc.setFontSize(30); //size in px
  let name = doc.splitTextToSize(fullName, 100);
  doc.text(50, 55, name, "center" || "");
  if (name.length == 1) {
    doc.setFontSize(20);
    let info = doc.splitTextToSize(briefInfo, 80);
    doc.text(50, 65, info, "center" || "");
  }
  if (name.length == 2) {
    doc.setFontSize(20);
    let info = doc.splitTextToSize(briefInfo, 80);
    doc.text(50, 78, info, "center" || "");
  }

  doc.addImage(imgData, "JPEG", 10, 95, 20, 20); // x , y , height, width in mm
  doc.setFontSize(10);
  doc.text(12, 117, attendeeCode || "");
  doc.save(fullName + ".pdf");
};
