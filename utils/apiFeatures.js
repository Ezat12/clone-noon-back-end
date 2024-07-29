class apiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filtraing() {
    /// req.body
    const queryStringObj = { ...this.queryString };

    // console.log(queryStringObj);

    // 1) filtration
    let feildsQuery = ["limit", "skip", "fields", "sort", "keyword"];
    feildsQuery.forEach((element) => {
      delete queryStringObj[element];
    });

    // {quantity : {$gts  :5} }
    let queryString = JSON.stringify(queryStringObj);
    let queryStrReplace = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStrReplace));
    // console.log(queryText);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort);
    } else {
      this.mongooseQuery.sort("createdAt");
    }
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery.select("-__v  -createdAt -updatedAt");
    }
    return this;
  }
  search(nameServer) {
    if (this.queryString.keyword) {
      const query = {};
      if (nameServer === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          {
            name: { $regex: this.queryString.keyword, $options: "i" },
          },
        ];
      }
      this.mongooseQuery.find(query);
    }
    return this;
  }
  pagination(countDoc) {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 50;
    let skip = (page - 1) * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;

    pagination.numberOfPage = Math.ceil(countDoc / limit);

    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = apiFeatures;
