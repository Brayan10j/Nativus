const nodemailer = require("nodemailer");

exports.sendEmail = async function (data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "info@ahumpilgrim.org",
      pass: "RAsiLPp@89"
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
    from: "info@ahumpilgrim.org",
    to: "info@ahumpilgrim.org, " + data.email
  };

  const emailSingUp = {
    subject: data.subject,
    html: `
      <h1>Welcome <b>${data.name}</b> </h1>
      <br>
      <p>Your token access is: <b>${data.message}</b></p>
    `,
    from: "info@ahumpilgrim.org",
    to:  data.email
  };

  const recoveryToken = {
    subject: data.subject,
    html: `
      <h1>Hello <b>${data.name}</b> </h1>
      <br>
      <p>You requested to recover your token <p>
      <br>
      <p>Your token access is: <b>${data.message}</b></p>
    `,
    from: "info@ahumpilgrim.org",
    to:  data.email
  };

  try {
    switch (data.subject) {
      case "singUp":
        await transporter.sendMail(emailSingUp);
        break;
      case "recovery":
        await transporter.sendMail(recoveryToken);
        break;
      default:
        await transporter.sendMail(emailSupport);
        break;
    }
    return "Email sent";
  } catch (err) {
    return err;
  }
}
