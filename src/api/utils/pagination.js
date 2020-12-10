const pagination = (currentPageNo, numberRecords, totalRecords, limit) => ({
  pagination: {
    currentPageNo,
    totalPages: Math.ceil(totalRecords / limit),
    numberRecords,
    totalRecords,
    limit,
  },
});

module.exports = pagination;
