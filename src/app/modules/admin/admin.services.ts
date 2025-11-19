import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import User from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { searchableFields } from "./admin.constant";

export const getAllUserService = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await users.modelQuery;

  return result;
};
