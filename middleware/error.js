//Ce middleware sert √† envoyer des message d'erreur au clientSide
//en format JSON avec un message personnalis√©

const errorHandler = (err, req, res, next) => {
  console.log(err);
  let message = err.message;
  let code = 400;
  //Invalid objectId
  if (err.name === "CastError") {
    code = 404;
    message = "Invalid objectId";
  }

  res.status(code).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
