const Proprietaire = require("../models/proprietaire");
const User = require("../models/user");

const paginationFiltering = (modelName, populate) => async (req, res, next) => {
  //req.query is a js object

  //Copy req.query
  const reqQueryCopy = { ...req.query };

  //Exclude some fields
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQueryCopy[param]);

  //Search by proprietaireId
  //add it to query object
  //this is more generic than check params in controller since it reserves all pagination/filtering features
  if (req.params.proprietaireId) {
    const pid = req.params.proprietaireId;
    const proprietaire = await Proprietaire.findById(pid);
    if (!proprietaire) {
      //no such proprietaire
      let err = new Error();
      err.message = `No proprietaire found with id ${pid}`;
      return next(err);
    }
    reqQueryCopy.proprietaire = pid;
  }

  //Fetch all the annonces of the logged in user!
  if (req.route.path === "/me") {
    const userid = req.user.id;
    const user = await User.findById(userid);
    if (!user) {
      //no such proprietaire
      let err = new Error();
      err.message = `No User found with id ${userid}`;
      return next(err);
    }
    reqQueryCopy.user = userid;
  }

  //Create query string
  let queryStr = JSON.stringify(reqQueryCopy);

  //Handling operator($gt , $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Store the query and manipulate it later
  query = modelName.find(JSON.parse(queryStr));

  //Selecting some fields
  if (req.query.select) {
    let selectStr = req.query.select;
    selectStr = selectStr.split(",").join(" ");
    query.select(selectStr);
  }

  //Sort
  if (req.query.sort) {
    let sortStr = req.query.sort;
    sortStr = sortStr.split(",").join(" ");
    query.sort(sortStr);
  }

  //Pagination setting
  const page = parseInt(req.query.page) || 1; // default page: 1
  const limit = parseInt(req.query.limit, 10) || 5; // default limit: 5
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let total = await modelName.countDocuments();

  //Total documents to be expected with this query
  total = (await query).length;
  query = query.skip(startIndex).limit(limit);

  //Populate certain fields
  //But dont do the populate if fetch by reference id
  if (populate && req.query.params === undefined) {
    query = query.populate(populate);
  }

  //Execution
  const results = await query;

  //Add pagination fields
  const pagination = {
    limit,
  };

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
    };
  }

  //documents in this page (0<x<limit)
  const count = results.length;
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
    };
  }

  res.results = {
    sucess: true,
    total,
    count,
    pagination,
    data: results,
  };
  next();
};

module.exports = paginationFiltering;
