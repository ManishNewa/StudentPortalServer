export const registrationEmailContent = (verificationUrl: String) =>
    `<h2
        style="font-size: 20px; margin-bottom: 15px; color: #6245b1"
        >
        Hey there
    </h2>
    <p style="margin: 0 0 15px">
        Thank you for registering with us. To complete your
        registration, please verify your email address by clicking
        the button below:
    </p>
    <a
        href="${verificationUrl}"
        style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #6245b1;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        "
        >Verify Email</a
    >
    <p style="margin: 0 0 15px">
        If you did not create an account with us, please ignore this
        email.
    </p>`;
