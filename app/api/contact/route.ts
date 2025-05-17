import type { NextRequest } from "next/server";
import { mailOptions, transporter } from "@/config/nodemailer";

// Type for form values
interface FormValues extends NextRequest {
  userName: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as FormValues;

  let { userName, email, message } = body;

  // Check if the input are valid
  const checked = checkValidation(userName, email, message);

  // If the input are not valid
  if (checked.status !== 200) {
    return new Response(
      JSON.stringify({
        errorName: checked.errorName,
        message: checked.errorMessage,
      }),
      { status: checked.status },
    );
  }

  // Trim the input
  userName = userName.trim();
  email = email.trim();
  message = message.trim();

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `A CUSTOMER CONTACT YOU`,
      html: `<!DOCTYPE html> <html> <head> <title></title> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css"> body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table { border-collapse: collapse !important; } body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; } @media screen and (max-width: 525px) { .wrapper { width: 100% !important; max-width: 100% !important; } .responsive-table { width: 100% !important; } .padding { padding: 10px 5% 15px 5% !important; } .section-padding { padding: 0 15px 50px 15px !important; } } .form-container { margin-bottom: 24px; padding: 20px; border: 1px dashed #ccc; } .form-heading { color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 400; text-align: left; line-height: 20px; font-size: 18px; margin: 0 0 8px; padding: 0; } .form-answer { color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 300; text-align: left; line-height: 20px; font-size: 16px; margin: 0 0 24px; padding: 0; } div[style*="margin: 16px 0;"] { margin: 0 !important; } </style>
    </head> <body style="margin: 0 !important; padding: 0 !important; background: #fff"> <div style=" display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; " ></div> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 10px 15px 30px 15px" class="section-padding" > <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px" class="responsive-table" > <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0" > <tr> <td style=" padding: 0 0 0 0; font-size: 16px; line-height: 25px; color: #232323; " class="padding message-content" > <h2>New Contact Message</h2> <div class="form-container">
    <h1 class="form-heading" align="left">Name</h1><p class="form-answer" align="left">${userName}</p>
    <h1 class="form-heading" align="left">Email</h1><p class="form-answer" align="left">${email}</p>
    <h1 class="form-heading" align="left">Message</h1><p class="form-answer" align="left">${message}</p>
    </div> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body> </html>`,
    });

    return new Response(JSON.stringify({ message: "Message sent." }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({ message: "Message couldn't sent." }), {
      status: 500,
    });
  }
}

// Function to check if the input are valid
const checkValidation = (name: string, email: string, message: string) => {
  // Error name, message, and status
  let errorName = "";
  let errorMessage = "";
  let status = 200;

  // Regex for validation
  const nameRegex = /^[a-z\u0600-\u06FF ,.'-]+$/i;
  const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/i;

  // Replace all double quotes with single quotes
  message = message.replace(`"`, `'`);

  // Check if the input are valid
  const nameTest = !nameRegex.test(name);
  const emailTest = emailRegex.test(email);

  // If name is not valid
  if (!name || !name.trim() || nameTest || name.length < 3) {
    // Address the error name
    errorName = "name";

    // If the name is empty
    if (!name || !name.trim()) {
      errorMessage = "Name is required";
      status = 400;

      // If the name is not valid
    } else if (nameTest) {
      errorMessage = "Only letters are allowed.";
      status = 406;

      // If the name is too short
    } else if (name.length < 3) {
      errorMessage = "Name must be at least 3 characters";
      status = 400;
    }
    return {
      errorName,
      errorMessage,
      status,
    };
    // ----------------------------------------------------------------

    // If email is not valid
  } else if (!email || !email.trim() || !emailTest) {
    // Address the error name
    errorName = "email";

    // If the email is empty
    if (!email || !email.trim()) {
      errorMessage = "Email is required";
      status = 400;

      // If the email is not valid
    } else if (!emailTest) {
      errorMessage = "Invalid email address";
      status = 406;
    }
    return {
      errorName,
      errorMessage,
      status,
    };
    // ----------------------------------------------------------------

    // If message is not valid
  } else if (!message || !message.trim() || message.length < 10) {
    // Address the error name
    errorName = "message";

    // If the message is empty
    if (!message || !message.trim()) {
      errorMessage = "Message is required";
      status = 400;

      // If the message is too short
    } else if (message.length < 10) {
      errorMessage = "Message must be at least 10 characters";
      status = 400;
    }
    return {
      errorName,
      errorMessage,
      status,
    };
    // ----------------------------------------------------------------
  }

  return {
    status,
  };
};
