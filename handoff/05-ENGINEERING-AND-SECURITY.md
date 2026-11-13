# Engineering requirements

## Implementation baseline
Inspect existing code before choosing tools. For a greenfield implementation, Next.js + TypeScript + Tailwind and Supabase Auth/Postgres is a reasonable recommendation. Pin dependencies and supply reproducible install/run commands. Separate public content, attendance domain logic and auth adapters. Do not introduce an elaborate CMS unless justified; typed content files are acceptable for prototype.

## Auth and authorization
Use a maintained auth provider, secure server sessions and protected endpoints. Do not write homemade password storage or keep session tokens in custom localStorage code. Teachers are invited/approved, not self-promoted through public registration. Verify role and branch/batch assignment for every read and write. Row-level policies need tests under ordinary authenticated identities, not only privileged service keys.
Never expose a service role key or database secret in client bundles. Never accept actor ID, role or scope from the browser as trusted. Use least privilege, safe cookies, framework/provider CSRF protections and appropriate origin checks for mutations. Validate data server-side, parameterize queries and render user text safely. Rate-limit login/enquiry abuse through appropriate infrastructure.

## Privacy
Attendance and student rosters are private. Public pages, analytics, error logs and screenshots must not expose them. Minimize collection, use synthetic data in demos, keep production logs free of unnecessary personal information. Scope exports. Supply a proposed privacy/retention policy for owner review rather than asserting legal compliance. Include a documented backup and restore procedure; actually test restoration in a safe environment before production claims.

## Database
Versioned migrations, foreign keys, indexes, uniqueness, transactions and audit integrity. Teacher access must not depend on hiding a sidebar link. Include teacher/coordinator/admin policies and cross-branch checks. Store time instants consistently; local school day is Asia/Dhaka. Preserve enrollments/history and verify report semantics.

## Demo mode
Run without external credentials using an explicit isolated synthetic demo, if needed for design review. Use an obvious demo banner and separate adapter. Production must fail closed if backend/auth configuration is missing; never fall back to fake auth. Document which features are mocked. A clickable login bypass is allowed only as a labelled local demo control, never as authentication.

## Public website
Enquiries need server persistence or verified delivery; don't silently discard submissions. Public forms must be validated, abuse-controlled and have error/retry states. Use sitemap, meaningful titles/descriptions, canonical URLs and legacy redirects. Never index portal pages; robots/noindex is not access control. Exclude private data from caches/static generation. Preserve SEO media/links during migration.

## Testing requirements
Unit tests for meaningful domain rules: roster eligibility, percentage policy, cancelled session handling and validation. Integration tests for auth/role scope, database policies, duplicate submission, transactions, concurrency and audit. End-to-end teacher marking, draft reload, submission and correction; mobile and keyboard smoke checks. Test unauthorized direct requests and cross-branch IDs. Do not describe synthetic screenshots as proof of backend correctness.

## Release boundaries
Owner must confirm hosting, DNS, production secrets, active content, attendance policy, data migration and authorization to deploy. Develop and prepare deployable artifacts first; do not overwrite live WordPress or point DNS automatically. Document rollback, migrations, staging verification and backups. No paid dependency or service purchase assumed.
