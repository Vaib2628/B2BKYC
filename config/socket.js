const createHttpError = require("http-errors");
const Membership = require("../models/Membership");
const { Server } = require("socket.io");
const { STATUS_CODES, ERROR_MESSAGES } = require("../constants/errorConstants");
const jwt = require("jsonwebtoken");

let io;
module.exports = {
    init: (server) => {
        io = new Server(server, {
            cors: { origin: "*", credentials: true }
        });

        io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth?.token;
                if (!token) return next(new createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED));

                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const membership = await Membership.findById(decoded.membershipId);
                if (!membership)
                    return next(createHttpError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND));

                socket.user = {
                    _id: membership.userId,
                    businessId: membership.businessId,
                    membershipId: membership._id
                };

                socket.join(`business:${membership.businessId}`);
                next();
            } catch (error) {
                next(createHttpError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED));
            }
        });

        io.on("connection", (socket) => {
            console.log("socket connected", socket.user._id);

            socket.on("disconnect", () => {
                console.log("socket disconnected", socket.user._id);
            });
        });

        return io;
    }
};
