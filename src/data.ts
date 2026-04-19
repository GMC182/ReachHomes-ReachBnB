
import { Table, Endpoint, ModulePrompt, TestSpec } from './types';

export const databaseSchema: Table[] = [
  {
    name: 'users',
    description: 'Master identity table with KYC and multi-tenant scoping.',
    reasoning: 'Separates authentication credentials from profile metadata for security.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', description: 'Primary ID' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Audited unique email' },
      { name: 'password_hash', type: 'VARCHAR(512)', description: 'Argon2id encoded' },
      { name: 'role', type: 'ENUM', description: 'JUAN, GEO_MANAGER, CLUSTER_MANAGER, OWNER, COLLABORATOR, CLIENT, PARTNER' },
      { name: 'is_verified', type: 'BOOLEAN', description: 'KYC status' },
      { name: 'mfa_enabled', type: 'BOOLEAN', description: 'Multi-factor flag' },
      { name: 'last_login_at', type: 'TIMESTAMP', description: 'Audit timestamp' }
    ]
  },
  {
    name: 'listings',
    description: 'Physical housing asset registry.',
    reasoning: 'Immutable core data for spatial queries and compliance.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', description: 'PK' },
      { name: 'host_id', type: 'UUID', key: 'FK', description: 'Owner reference' },
      { name: 'lat_long', type: 'POINT', description: 'Spatial coordinates' },
      { name: 'listing_type', type: 'ENUM', description: 'HOME, ROOM, SHARED' },
      { name: 'max_guests', type: 'INT', description: 'Physical capacity' },
      { name: 'amenities_bitmask', type: 'BIGINT', description: 'Efficient amenity storage' },
      { name: 'status', type: 'ENUM', description: 'DRAFT, ACTIVE, SUSPENDED' }
    ]
  },
  {
    name: 'availability_calendar',
    description: 'Night-by-night pricing and booking availability.',
    reasoning: 'Optimized for high-concurrency search and yield management.',
    columns: [
      { name: 'listing_id', type: 'UUID', key: 'FK', description: 'Target listing' },
      { name: 'date', type: 'DATE', description: 'Target night' },
      { name: 'price_micros', type: 'BIGINT', description: 'Price in local currency' },
      { name: 'is_blocked', type: 'BOOLEAN', description: 'Manual host block' },
      { name: 'reservation_id', type: 'UUID', key: 'FK', description: 'Current booking if any' }
    ]
  },
  {
    name: 'reservations',
    description: 'Contractual agreement between guest and host.',
    reasoning: 'Manages the state machine of the rental lifecycle.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', description: 'Booking ID' },
      { name: 'guest_id', type: 'UUID', key: 'FK', description: 'Booker' },
      { name: 'total_price_micros', type: 'BIGINT', description: 'Total cost' },
      { name: 'status', type: 'ENUM', description: 'PENDING, PAID, CANCELLED, COMPLETED' },
      { name: 'check_in', type: 'DATE', description: 'Start' },
      { name: 'check_out', type: 'DATE', description: 'End' }
    ]
  },
  {
    name: 'ledger_entries',
    description: 'Immutable financial double-entry bookkeeping.',
    reasoning: 'Audit trail for service fees, payouts, and taxes.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', description: 'TX_ID' },
      { name: 'reservation_id', type: 'UUID', key: 'FK', description: 'Origin' },
      { name: 'amount', type: 'DECIMAL(19,4)', description: 'Amount' },
      { name: 'type', type: 'ENUM', description: 'PAYMENT, PAYOUT, REFUND, FEE' },
      { name: 'processed_at', type: 'TIMESTAMP', description: 'Execution time' }
    ]
  }
];

export const apiEndpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/search',
    summary: 'Geo-Spatial Listing Search',
    response: '[{id, title, price, lat, lng}]',
    reasoning: 'Primary search entry point with real-time availability filter.',
    businessLogic: ['Filter by coordinates', 'Cross-check calendar blocks', 'Calculate dynamic taxes'],
    auditNotes: ['Publicly accessible', 'Rate limited'],
    implementationCode: `@GetMapping("/search")
public List<SearchResult> search(@RequestParam double lat, @RequestParam double lng) {
    return listingService.findAvailable(lat, lng);
}`
  },
  {
    method: 'POST',
    path: '/api/v1/ops/task/complete',
    summary: 'Collaborator Task Sign-off',
    response: '{success: true}',
    reasoning: 'Trigger point for turnover verification and owner notification.',
    businessLogic: ['Check RBAC', 'Update Task Status', 'Trigger Payout Release'],
    auditNotes: ['Requires JWT with COLLABORATOR role', 'Timestamp recorded'],
    implementationCode: `@PostMapping("/ops/task/complete")
public ResponseEntity complete(@RequestBody TaskID id) {
    return opsManager.finalize(id);
}`
  }
];

export const modulePrompts: ModulePrompt[] = [
  {
    id: 'p23',
    phase: 8,
    title: 'Juan (Super Admin) Terminal',
    description: 'Global infrastructure monitor.',
    promptContent: 'Implement a dashboard for JUAN that displays real-time infrastructure health (CPU/Latency), global transaction stream, and forensic logs.'
  },
  {
    id: 'p17',
    phase: 7,
    title: 'Geo Manager Dashboard',
    description: 'Regional oversight and performance.',
    promptContent: 'Implement a dashboard for Geo Managers to monitor regional revenue, active clusters, and critical alerts.'
  },
  {
    id: 'p18',
    phase: 7,
    title: 'Cluster Manager Dashboard',
    description: 'Local operations and staff management.',
    promptContent: 'Implement a dashboard for Cluster Managers to oversee local properties, active staff, and pending tasks.'
  },
  {
    id: 'p19',
    phase: 7,
    title: 'Owner Studio',
    description: 'Asset performance and profile management.',
    promptContent: 'Implement a dashboard for Owners to view property performance, manage profiles, and track earnings.'
  },
  {
    id: 'p20',
    phase: 7,
    title: 'Collaborator Ops Mobile App',
    description: 'Shift terminal for collaborators.',
    promptContent: 'Implement a mobile-optimized view for Collaborators with active turnover checklists, inventory restock alerts, and damage reporting.'
  },
  {
    id: 'p21',
    phase: 7,
    title: 'Partner Hub',
    description: 'Vendor service requests and contracts.',
    promptContent: 'Implement a dashboard for Partners to manage service requests, track earnings, and view active contracts.'
  },
  {
    id: 'p22',
    phase: 7,
    title: 'Guest Marketplace',
    description: 'Property discovery and booking.',
    promptContent: 'Implement a marketplace for Guests to search for properties, view listings, and make reservations.'
  }
];

export const testSpecs: TestSpec[] = [
  {
    id: 'TX_LEDGER',
    title: 'Financial Integrity',
    userStory: 'As Juan, I want to ensure every dollar is accounted for.',
    backendTests: ['sum(payments) == sum(payouts) + sum(fees)', 'Atomic reservation commits'],
    frontendTests: ['Snapshot consistency on dashboard'],
    productionExpectations: ['Zero manual ledger edits permitted', 'Daily reconciliation jobs']
  }
];
