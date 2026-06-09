// Read at runtime (not module load) so Vercel env vars work after deploy.
// Bracket access avoids Next.js inlining undefined at build time.
export function getMongoUri(): string | undefined {
    const uri = process.env['MONGODB_URI'];
    return typeof uri === 'string' ? uri.trim() : undefined;
}
