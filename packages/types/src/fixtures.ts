// Deterministic fixtures for tests. Not shipped to production clients.
// The app-level mock fixtures live in apps/web/src/data/fixtures.ts while the
// backend is stubbed; they will converge here once @piramid/api is fully wired.

export { seededRandom, pick } from "./fixtures/rand";
