import emailjs from "@emailjs/nodejs";

const roleLabel = (role) => {
    if (role === "user") return "Customer";
    if (role === "delivery") return "Delivery Agent";
    return "Admin";
};

const sendOTP = async (email, otp, name, role, purpose = "login") => {
    const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
    const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim();
    const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
    const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

    if (!serviceId || !templateId || !publicKey) {
        throw new Error(
            "EmailJS is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY."
        );
    }

    const isReset = purpose === "reset";
    const title = isReset ? "Password Reset" : "Account Verification";
    const intro = isReset
        ? "We received a request to reset your password. Please use the One-Time Password (OTP) below to continue:"
        : "We received a request to verify your account. Please use the One-Time Password (OTP) below to proceed:";
    const subject = isReset
        ? "Password Reset OTP - CraveIt"
        : "Your One-Time Password - CraveIt";

    const templateParams = {
        to_email: email,
        email,
        name: name || "User",
        otp: String(otp),
        role_label: roleLabel(role),
        title,
        intro,
        subject,
    };

    const options = { publicKey };
    if (privateKey) {
        options.privateKey = privateKey;
    }

    try {
        await emailjs.send(serviceId, templateId, templateParams, options);
    } catch (error) {
        const detail = error?.text || error?.message || "Unknown EmailJS error";
        console.error("EmailJS send failed:", detail);
        throw new Error(detail);
    }
};

export default sendOTP;
