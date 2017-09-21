module.exports = (server) =>{
    require("./forside")(server);
    require("./produkter")(server);
    require("./produkt")(server);
    require("./kategorier")(server);

}
