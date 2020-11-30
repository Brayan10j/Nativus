const nodemailer = require("nodemailer");

exports.sendEmail = async function (data) {
  const transporter = nodemailer.createTransport({
    host: "cycron.tech",
    port: 465,
    secure: true,
    auth: {
      user: "brain@cycron.tech",
      pass: "0rJlZ45IvUpe"
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const emailSupport = {
    subject: data.subject,
    html: `
      <p><b>Contact Message </b></p>
      <p>my name is ${data.name}</p>
      <br>
      <p>${data.message}</p>
    `,
    from: "brain@cycron.tech",
    to: "support@cycron.tech, " + data.email
  };

  const emailSingUp = {
    subject: data.subject,
    html: `
      <h1>Welcome <b>${data.name}</b> </h1>
      <br>
      <p>Your token access is: <b>${data.message}</b></p>
    `,
    from: "brain@cycron.tech",
    to:  data.email
  };

  try {
    if(data.subject == "singUp"){
      await transporter.sendMail(emailSingUp);
    }else{
      await transporter.sendMail(emailSupport);
    }

    return "Email sent";
  } catch (err) {
    return err;
  }
}
