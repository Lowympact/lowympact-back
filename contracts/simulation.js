const Actor = require("./actor");
const Transaction = require("./transaction");

module.exports = {
    // TODO :
    // - Créer 3 acteurs
    // - Créer 2 transactions
    // - Retrouver l'origine du produit à partir de son id donné
    // Cf. https://github.com/arvindkalra/express-box/blob/master/server.js

    main: function () {
        const addressActor1 = await Actor.createActor(
            "CAR",
            "Carrefour",
            "maker",
            latitude,
            longitude,
            (owner)
        );
    },
};
