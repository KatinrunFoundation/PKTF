
makeRandomId = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

String2Hex = (tmp) => {
    let str = '';
    for (let i = 0; i < tmp.length; i++) {
      str += tmp[i].charCodeAt(0).toString(16);
    }
    return str;
  }

module.exports = {
    makeRandomId,
    String2Hex
}