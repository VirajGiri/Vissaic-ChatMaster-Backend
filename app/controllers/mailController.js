var nodemailer = require('nodemailer');

exports.sendMail = function (MailData){

    var transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth: {
            user:'myelinuser@gmail.com',
            pass:'Myelin@123'
        }


    });

    var mailOptions = {
        from : 'myelinuser@gmail.com',
        to: MailData.Emailid,
        subject: MailData.Subject,
        text: MailData.text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if(error){
            console.log(error);
            if(error.errno == 'ETIMEDOUT'){
                transporter.sendMail(mailOptions, function (error, info) {
                    if(error){
                        console.log(error);
                        if(error.errno == 'ETIMEDOUT'){

                        }
                    }else{
                        console.log('Email sent:', + info.response);
                    }

                });
            }
        }else{
            console.log('Email sent:', + info.response);
        }

    });
}
