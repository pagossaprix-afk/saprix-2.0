import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // Verify cron secret to prevent unauthorized access
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'dev-secret-change-in-production';

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Call the sync-products endpoint
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const syncUrl = `${baseUrl}/api/sync-products`;

        const response = await fetch(syncUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        return NextResponse.json({
            success: true,
            message: "Cron job executed successfully",
            syncResult: result,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Cron job failed",
                message: error?.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}
