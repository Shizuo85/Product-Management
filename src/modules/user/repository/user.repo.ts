import userModel from '../models/user.model';

class UserRepo {
    async create(data: any) {
        return await userModel.create(data);
    }

    async findOne(filter: any, select: any = {}) {
        return await userModel
            .findOne({ ...filter, is_deleted: false })
            .select(select);
    }

    async updateOne(filter: any, data: any) {
        return await userModel.findOneAndUpdate(
            { ...filter, is_deleted: false },
            data,
            {
                upsert: false,
            }
        );
    }

    async updateOneAndReturn(filter: any, data: any, select: any = {}) {
        return await userModel
            .findOneAndUpdate({ ...filter, is_deleted: false }, data, {
                new: true,
                upsert: false,
            })
            .select(select);
    }

    async deleteOne(filter: any) {
        return await userModel.findOneAndUpdate(
            { ...filter, is_deleted: false },
            {
                is_deleted: true,
            },
            {
                upsert: false,
            }
        );
    }
}

export default new UserRepo();
