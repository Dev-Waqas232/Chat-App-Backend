import catchAsync from "../utils/catchAsync.js";

const register = catchAsync(async (req, res, next) => {});

const login = catchAsync(async (req, res, next) => {});

const verify = catchAsync(async (req, res, next) => {});

const refresh = catchAsync(async (req, res, next) => {});

export { register, login, refresh, verify };
