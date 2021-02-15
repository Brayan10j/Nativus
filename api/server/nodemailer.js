const nodemailer = require("nodemailer");

exports.sendEmail = async function(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@ahumpilgrim.org",
      pass: "RAsiLPp@89"
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const buy = {
    subject: data.subject,
    html: `
      <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
              <tr>
                  <td class="esd-block-image es-p25t es-p25b es-p35r es-p35l" align="center" style="font-size:0"><a target="_blank" href="https://viewstripo.email/"><img src="https://tlr.stripocdn.email/content/guids/CABINET_75694a6fc3c4633b3ee8e3c750851c02/images/67611522142640957.png" alt style="display: block;" width="120"></a></td>
              </tr>
              <tr>
                  <td class="esd-block-text es-p10b" align="center">
                      <h2>Thank You For Your Order!</h2>
                  </td>
              </tr>
              <tr>
                  <td class="esd-block-text es-p15t es-p20b" align="center">
                      <p style="font-size: 16px; color: #777777;">Hello ${data.name} , you have bought the product or service with the following name :</p>
                      <br>
                      <b>${data.message}</b></p>
                  </td>
              </tr>
          </tbody>
      </table>

    `,
    from: "info@ahumpilgrim.org",
    to: data.email
  };

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
    to: data.email
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
    to: data.email
  };

  try {
    switch (data.subject) {
      case "singUp":
        await transporter.sendMail(emailSingUp);
        break;
      case "recovery":
        await transporter.sendMail(recoveryToken);
        break;
      case "buy":
        await transporter.sendMail(buy);
        break;
      default:
        await transporter.sendMail(emailSupport);
        break;
    }
    return "Email sent";
  } catch (err) {
    return err;
  }
};
