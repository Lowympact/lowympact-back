const Actor = require("./actor");
const Transaction = require("./transaction");

module.exports = {
    // TODO :
    // - Créer 3 acteurs
    // - Créer 2 transactions
    // - Retrouver l'origine du produit à partir de son id donné
    // Cf. https://github.com/arvindkalra/express-box/blob/master/server.js

    main: function (web3) {
        const CAR1 = Actor.createActor(
            "CAR-69100",
            "Carrefour Villeurbanne",
            "maker",
            "45.76478",
            "4.88037",
            web3
        );
        /*
        const CAR2 = await Actor.createActor(
            "CAR-69100",
            "Carrefour Lyon Part Dieu",
            "maker",
            "45.761467",
            "4.857217",
            (owner)
        );*/
    },
};
