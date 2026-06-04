module.exports = async ({ model, filter = {}, populate, options = {}, select, sort = { createdAt: -1 } }) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = model.find(filter).skip(skip).limit(limit).sort(sort);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);

    const [totalDocs, docs] = await Promise.all([model.countDocuments(filter), query.exec()]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
        docs,
        paginate: {
            page,
            limit,
            totalPages,
            pageRecords: docs.length,
            totalRecords: totalDocs,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};
