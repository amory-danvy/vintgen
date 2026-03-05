// @ts-ignore
import { mutation } from "./_generated/server";

export const spendCredit = mutation({
    args: {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: async (ctx: any) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Utilisateur non authentifié.");
        }

        // Identity.tokenIdentifier usually contains the clerk userId
        const clerkId = identity.subject;

        const todayStr = new Date().toISOString().split('T')[0];

        const user = await ctx.db
            .query("users")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .withIndex("by_clerkId", (q: any) => q.eq("clerkId", clerkId))
            .first();

        if (!user) {
            // Create new user, spending 1 credit
            await ctx.db.insert("users", {
                clerkId,
                creditsUsedToday: 1,
                lastGenerationDate: todayStr,
            });
            return { success: true };
        }

        // Has day changed?
        let currentCredits = user.creditsUsedToday;
        if (user.lastGenerationDate !== todayStr) {
            currentCredits = 0;
        }

        if (currentCredits >= 2) {
            return { success: false, error: "LIMIT_REACHED" };
        }

        // Update user
        await ctx.db.patch(user._id, {
            creditsUsedToday: currentCredits + 1,
            lastGenerationDate: todayStr,
        });

        return { success: true };
    },
});
