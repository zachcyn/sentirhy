const emailTemplate = (username, email, resetLink) => {
    return `
    <table style="border-collapse:collapse;padding:0;max-width:480px;width:100%;border:0;background-color:#ffffff;margin:0 auto;word-break:break-word" cellpadding="0" cellspacing="0">
        <tbody style="border:none;padding:0;margin:0">
            <tr style="border:none;margin:0px;padding:0px">
                <td style="border:none;padding:0;margin:0">
                    <div id="main" style="border:none;padding:0;margin:0">
                        <table style="border-collapse:collapse;padding:0;background-color:#ffffff;text-align:left;width:100%;height:50px">
                            <tbody style="border:none;padding:0;margin:0">
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <a href="https://localhost:3030" style="text-decoration:none;color:#1ed760" target="_blank">
                                            <img alt="Sentirhy" style="display:block;max-width:100%;margin-right:auto;width:180px;height:55px" height="37" src="cid:color-logo" />
                                        </a>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="border-collapse:collapse;padding:0;width:100%;background-color:#ffffff;font-family:'Helvetica','Arial',sans-serif!important;font-size:40px" dir="auto">
                            <tbody style="border:none;padding:0;margin:0">
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <p style="border:none;padding:0;margin:0;background-color:#ffffff;color:#000000;font-size:40px;font-family:'Helvetica','Arial',sans-serif!important;font-weight:400;text-align:center;line-height:1.5">
                                            <b style="border:none;padding:0;margin:0">Hello.</b>
                                        </p>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="border-collapse:collapse;padding:0;width:100%;background-color:#ffffff;font-family:'Helvetica','Arial',sans-serif!important;font-size:14px" dir="auto">
                            <tbody style="border:none;padding:0;margin:0">
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <p style="border:none;padding:0;margin:0;background-color:#ffffff;color:#000000;font-size:14px;font-family:'Helvetica','Arial',sans-serif!important;font-weight:400;text-align:left;line-height:1.5">
                                            No need to worry, you can reset your Sentirhy password by clicking the link below:<br><br>
                                            <a href="${resetLink}" target="_blank">Reset password</a>
                                        </p>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <p style="border:none;padding:0;margin:0;background-color:#ffffff;color:#000000;font-size:14px;font-family:'Helvetica','Arial',sans-serif!important;font-weight:400;text-align:left">
                                            Your username is: ${username}
                                        </p>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <p style="border:none;padding:0;margin:0;background-color:#ffffff;color:#000000;font-size:14px;font-family:'Helvetica','Arial',sans-serif!important;font-weight:400;text-align:left;line-height:1.5">
                                            If you didn't request a password reset, feel free to delete this email and carry on enjoying your music!
                                        </p>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <p style="border:none;padding:0;margin:0;background-color:#ffffff;color:#000000;font-size:14px;font-family:'Helvetica','Arial',sans-serif!important;font-weight:400;text-align:left;line-height:1.5;">
                                            The Best,<br>
                                            The Sentirhy Team
                                        </p>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:24px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:24px">
                                    <td colspan="3" style="border:none;padding:0;margin:0;height:24px"></td>
                                </tr>
                            </tbody>
                        </table>
  
                        <table style="border-collapse:collapse;padding:0;background-color:#f7f7f7;width:100%" dir="auto">
                            <tbody style="border:none;padding:0;margin:0">
                                <tr style="border:none;margin:0px;padding:0px;height:25px">
                                    <td colspan="3" style="border:none;padding:6.25px;margin:0;height:25px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                    <td style="border:none;padding:0;margin:0">
                                        <img alt="Sentirhy Logo" height="23" style="display:block;max-width:100%;height:23px" src="cid:grey-logo" data-bit="iit">
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:12px">
                                <td colspan="3" style="border:none;padding:3px;margin:0;height:12px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                    <td style="border:none;padding:0;margin:0;font-family:'Helvetica','Arial',sans-serif;font-weight:400;line-height:1.65em;letter-spacing:0.15px;font-size:11px;text-decoration:none;color:#88898c">
                                        This message was sent to <a href="${email}" target="_blank">${email}</a>. If you have questions or complaints, please <a href="your-contact-us-link" style="text-decoration:none;color:#6d6d6d;font-weight:bold" target="_blank">contact us</a>.
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:12px">
                                    <td colspan="3" style="border:none;padding:3px;margin:0;height:12px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                    <td style="border:none;padding:0;margin:0;font-family:'Helvetica','Arial',sans-serif;font-weight:400;line-height:1.65em;letter-spacing:0.15px;font-size:11px;text-decoration:none;color:#88898c">
                                        <a style="text-decoration:none;color:#6d6d6d;display:inline-block;font-weight:700" href="your-terms-of-use-link" target="_blank">Terms of Use</a>
                                        <span style="border:none;padding:4px 0;margin:0 7px;width:1px;border-left:solid 1px #c3c3c3;border-right:solid 1px transparent">&nbsp;</span>
                                        <a style="text-decoration:none;color:#6d6d6d;display:inline-block;font-weight:700" href="your-contact-us-link" target="_blank">Contact Us</a>
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:12px">
                                    <td colspan="3" style="border:none;padding:3px;margin:0;height:12px"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px">
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                    <td style="border:none;padding:0;margin:0;font-family:'Helvetica','Arial',sans-serif;font-weight:400;line-height:1.65em;letter-spacing:0.15px;font-size:11px;text-decoration:none;color:#88898c">
                                        Sentirhy, Filton, Bristol, United Kingdom
                                    </td>
                                    <td style="border:none;padding:0;margin:0;width:6.25%"></td>
                                </tr>
                                <tr style="border:none;margin:0px;padding:0px;height:25px">
                                    <td colspan="3" style="border:none;padding:6.25px;margin:0;height:25px"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
                        
    `;
};

module.exports = emailTemplate;