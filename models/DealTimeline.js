const { default: mongoose } = require("mongoose");

const dealTimelineSchema = new mongoose.Schema({
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: "deal", required: true },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "business", required: true },
    event: { type: String, required: true },
    description: { type: String, required: true },
    previousState: { type: String, default: null },
    currentState: { type: String, default: null }
});

dealTimelineSchema.index({ dealId: 1, createdAt: 1 });

module.exports = mongoose.model("dealtimeline", dealTimelineSchema);
