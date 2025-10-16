import { Resend } from "resend";

const sendEmail = async (to: string, url: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const email = await resend.emails.send({
      from: "onboarding@resend.dev", // safe default
      to : "affanmulla077@gmail.com", // test email
      subject: "Verify your sign-in",
      html: `<p>Click <a href="${url}">here</a> to verify</p>`,
    });

    return email.data ? true : false
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

export default sendEmail ;