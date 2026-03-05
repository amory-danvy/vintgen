import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        creditsUsedToday: v.number(),
        lastGenerationDate: v.string(), // Format: "YYYY-MM-DD"
    }).index("by_clerkId", ["clerkId"]),
});
