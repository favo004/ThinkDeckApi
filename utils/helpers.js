
export const GetUserPostErrorMessage = (err) => {
    let message = "";
    const split = err.message.split(/[:,]/);

    for (let i = 2; i < split.length; i += 2) {
        if(i > 2) message += ' ';
        
        message += split[i].trim();
    }

    return message;
}