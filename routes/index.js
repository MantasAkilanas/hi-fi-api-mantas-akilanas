module.exports = (server) =>{
    require("./forside")(server);
    require("./produkter")(server);
    require("./kategorier")(server);
}
