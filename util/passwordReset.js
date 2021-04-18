exports.generate_token = function(length){
    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    let b = [];
    for (let i=0; i<length; i++) {
        let j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

exports.sendResetEmail = async (userMail, userName, userResetToken, userResetDate) => {

    const run = async () => {
        try {
            console.log("Not implemented yet.");
        } catch (err) {
            console.error(err, err.stack);
        }
    };

    await run();
}

function formatDate(date) {

    let year = date.getFullYear(),
        month = '' + (date.getMonth()+1),
        day = '' + date.getDate(),
        hour =  '' + date.getHours(),
        minut = '' + date.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if(hour.length <2)
        hour = '0' + hour;
    if(minut.length <2)
        minut = '0' + minut;

    return day + "/" + month + "/" + year + " à " + hour + "h" + minut;
}