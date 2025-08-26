import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Google OAuth is handled entirely on the client side
    // This endpoint is not used for the OAuth flow
    return NextResponse.json(
        {
            success: false,
            error: 'Google authentication is handled on the client side. Use the loginWithGoogle function from the AuthContext instead.'
        },
        { status: 400 }
    );
}
