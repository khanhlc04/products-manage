module.exports = (query) => {
    if(query.keyword){
        const regex = new RegExp(query.keyword, "i");
        return regex;
    }
}