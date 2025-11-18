import type { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public queryParams: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, queryParams: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.queryParams = queryParams;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.queryParams.searchTerm;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm as string, $options: "i" },
        })),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryParams };

    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

    excludeFields.forEach((element) => delete queryObj[element]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.queryParams?.sort as string)?.split(",")?.join(" ") ||
      "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this?.queryParams?.page) || 1;
    const limit = Number(this?.queryParams?.limit) || 6;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this?.queryParams?.fields as string)?.split(",")?.join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.queryParams?.page) || 1;
    const limit = Number(this?.queryParams?.limit) || 6;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
