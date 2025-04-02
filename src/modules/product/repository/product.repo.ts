import productModel from '../models/product.model';

class ProductRepo {
    async create(data: any) {
        return await productModel.create(data);
    }

    async findOne(filter: any, select: any = {}) {
        return await productModel
            .findOne({ ...filter, is_deleted: false })
            .select(select);
    }

    async updateOne(filter: any, data: any) {
        return await productModel.findOneAndUpdate(
            { ...filter, is_deleted: false },
            data,
            {
                upsert: false,
            }
        );
    }

    async updateOneAndReturn(filter: any, data: any, select: any = {}) {
        return await productModel
            .findOneAndUpdate({ ...filter, is_deleted: false }, data, {
                new: true,
                upsert: false,
            })
            .select(select);
    }

    async deleteOne(filter: any) {
        return await productModel.findOneAndUpdate(
            { ...filter, is_deleted: false },
            {
                is_deleted: true,
            },
            {
                upsert: false,
            }
        );
    }

    async fetchProducts(filter: any, limit: number, page: number) {
        const [{ products, count }] = await productModel.aggregate([
            {
                $match: { ...filter, is_deleted: false },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creator',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: {
                                    $concat: [
                                        { $ifNull: ['$first_name', ''] },
                                        {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {
                                                            $ne: [
                                                                {
                                                                    $toString:
                                                                        '$first_name',
                                                                },
                                                                null,
                                                            ],
                                                        },
                                                        {
                                                            $ne: [
                                                                {
                                                                    $toString:
                                                                        '$last_name',
                                                                },
                                                                null,
                                                            ],
                                                        },
                                                    ],
                                                },
                                                ' ',
                                                '',
                                            ],
                                        },
                                        { $ifNull: ['$last_name', ''] },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$creator',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    category: 1,
                    inventory: 1,
                    variant: 1,
                    creator: 1,
                },
            },
            {
                $sort: {
                    category: 1,
                    name: 1,
                },
            },
            {
                $facet: {
                    products: [
                        {
                            $skip: (page - 1) * limit,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                    count: [
                        {
                            $count: 'count',
                        },
                    ],
                },
            },
        ]);

        const total_count = count[0]?.count ?? 0;
        const total_pages = Math.ceil(total_count / limit);

        return {
            products,
            total_count,
            page,
            total_pages,
        };
    }
}

export default new ProductRepo();
