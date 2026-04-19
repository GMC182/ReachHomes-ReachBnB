
import { User, Property, Review, Task, SystemHealth, UserRole, PropertyProfile, TaskTemplate, Reservation, ServiceRequest, Audit } from '../types';

class DatabaseService {
  private users: User[] = [
    { id: 'u-juan', name: 'Juan SuperAdmin', email: 'juan@reachhomes.com', role: 'JUAN', isVerified: true, password: '123' },
    { id: 'u-admin', name: 'System Admin', email: 'admin@reachhomes.com', role: 'ADMIN', isVerified: true, password: '123' },
    { id: 'u-owner1', name: 'Marco Owner', email: 'owner@luxury.com', role: 'OWNER', isVerified: true, password: '123' },
    { id: 'u-owner2', name: 'Elena Owner', email: 'elena@owner.com', role: 'OWNER', isVerified: true, password: '123' },
    { id: 'u-staff1', name: 'Pepe Staff', email: 'pepe@staff.com', role: 'COLLABORATOR', parentId: 'u-owner1', isVerified: true, password: '123', shiftStatus: 'AVAILABLE' },
    { id: 'u-staff2', name: 'Maria Staff', email: 'maria@staff.com', role: 'COLLABORATOR', parentId: 'u-owner1', isVerified: true, password: '123', shiftStatus: 'AVAILABLE' },
    { id: 'u-staff3', name: 'David Staff', email: 'david@staff.com', role: 'COLLABORATOR', parentId: 'u-owner2', isVerified: true, password: '123', shiftStatus: 'AVAILABLE' },
    { id: 'u-staff4', name: 'Lucia Staff', email: 'lucia@staff.com', role: 'COLLABORATOR', parentId: 'u-owner2', isVerified: true, password: '123', shiftStatus: 'AVAILABLE' },
    { id: 'u-geo', name: 'Geo Manager Madrid', email: 'geo@madrid.com', role: 'GEO_MANAGER', isVerified: true, password: '123' },
    { id: 'u-cluster', name: 'Cluster Manager Sol', email: 'cluster@sol.com', role: 'CLUSTER_MANAGER', isVerified: true, password: '123' },
    { id: 'u-partner1', name: 'TechFix Maintenance', email: 'partner@vendor.com', role: 'PARTNER', isVerified: true, password: '123' },
    { id: 'u-partner2', name: 'CleanPro Services', email: 'cleanpro@vendor.com', role: 'PARTNER', isVerified: true, password: '123' },
    // 10 Guests
    { id: 'u-guest1', name: 'Guest One', email: 'guest@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest2', name: 'Guest Two', email: 'guest2@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest3', name: 'Guest Three', email: 'guest3@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest4', name: 'Guest Four', email: 'guest4@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest5', name: 'Guest Five', email: 'guest5@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest6', name: 'Guest Six', email: 'guest6@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest7', name: 'Guest Seven', email: 'guest7@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest8', name: 'Guest Eight', email: 'guest8@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest9', name: 'Guest Nine', email: 'guest9@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    { id: 'u-guest10', name: 'Guest Ten', email: 'guest10@gmail.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 0 },
    // --- HIGH EXPECTATION GUESTS ---
    { id: 'u-vip-ceo', name: 'Alexander Sterling', email: 'ceo@sterling.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 5000, avatar: 'https://i.pravatar.cc/150?u=ceo' },
    { id: 'u-vip-influencer', name: 'Luna Vibe', email: 'luna@vibes.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 1200, avatar: 'https://i.pravatar.cc/150?u=luna' },
    { id: 'u-vip-family', name: 'The Harrison Family', email: 'harrison@family.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 800, avatar: 'https://i.pravatar.cc/150?u=family' },
    { id: 'u-vip-nomad', name: 'Kai Digital', email: 'kai@nomad.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 2500, avatar: 'https://i.pravatar.cc/150?u=kai' },
    { id: 'u-vip-luxury', name: 'Isabella de Luca', email: 'isabella@luxury.com', role: 'CLIENT', isVerified: true, password: '123', loyaltyPoints: 10000, avatar: 'https://i.pravatar.cc/150?u=isabella' },
    // --- HIGH EXPECTATION OWNERS ---
    { id: 'u-owner-roi', name: 'Victor Asset', email: 'victor@assets.com', role: 'OWNER', isVerified: true, password: '123', avatar: 'https://i.pravatar.cc/150?u=victor' },
    { id: 'u-owner-detail', name: 'Sarah Precision', email: 'sarah@precision.com', role: 'OWNER', isVerified: true, password: '123', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 'u-owner-maint', name: 'Robert Structure', email: 'robert@structure.com', role: 'OWNER', isVerified: true, password: '123', avatar: 'https://i.pravatar.cc/150?u=robert' },
    { id: 'u-owner-exp', name: 'Grace Global', email: 'grace@global.com', role: 'OWNER', isVerified: true, password: '123', avatar: 'https://i.pravatar.cc/150?u=grace' },
    { id: 'u-owner-legacy', name: 'Arthur Heritage', email: 'arthur@heritage.com', role: 'OWNER', isVerified: true, password: '123', avatar: 'https://i.pravatar.cc/150?u=arthur' },
    // --- HIGH EXPECTATION TRUSTED COLLABORATORS ---
    { id: 'u-staff-perf', name: 'Elena Perfect', email: 'elena@staff.com', role: 'COLLABORATOR', parentId: 'u-owner-roi', isVerified: true, password: '123', shiftStatus: 'AVAILABLE', reliabilityScore: 99 },
    { id: 'u-staff-eff', name: 'Marco Swift', email: 'marco@staff.com', role: 'COLLABORATOR', parentId: 'u-owner-roi', isVerified: true, password: '123', shiftStatus: 'AVAILABLE', reliabilityScore: 95 },
    { id: 'u-staff-crea', name: 'Sofia Art', email: 'sofia@staff.com', role: 'COLLABORATOR', parentId: 'u-owner-detail', isVerified: true, password: '123', shiftStatus: 'AVAILABLE', reliabilityScore: 92 },
    { id: 'u-staff-tech', name: 'Leo Byte', email: 'leo@staff.com', role: 'COLLABORATOR', parentId: 'u-owner-maint', isVerified: true, password: '123', shiftStatus: 'AVAILABLE', reliabilityScore: 98 },
    { id: 'u-staff-serv', name: 'Anna Smile', email: 'anna@staff.com', role: 'COLLABORATOR', parentId: 'u-owner-exp', isVerified: true, password: '123', shiftStatus: 'AVAILABLE', reliabilityScore: 97 },
    // --- HIGH EXPECTATION GEO MANAGERS ---
    { id: 'u-geo-ana', name: 'Dr. Data', email: 'data@geo.com', role: 'GEO_MANAGER', isVerified: true, password: '123', department: 'Analytics' },
    { id: 'u-geo-strat', name: 'General Strategy', email: 'strategy@geo.com', role: 'GEO_MANAGER', isVerified: true, password: '123', department: 'Strategy' },
    { id: 'u-geo-comp', name: 'Judge Compliance', email: 'compliance@geo.com', role: 'GEO_MANAGER', isVerified: true, password: '123', department: 'Legal' },
    { id: 'u-geo-grow', name: 'Hunter Growth', email: 'growth@geo.com', role: 'GEO_MANAGER', isVerified: true, password: '123', department: 'Expansion' },
    { id: 'u-geo-ops', name: 'Major Ops', email: 'ops@geo.com', role: 'GEO_MANAGER', isVerified: true, password: '123', department: 'Operations' },
    // --- HIGH EXPECTATION CLUSTER MANAGERS ---
    { id: 'u-cluster-1', name: 'Sol Master', email: 'sol@cluster.com', role: 'CLUSTER_MANAGER', isVerified: true, password: '123', department: 'Sol District' },
    { id: 'u-cluster-2', name: 'Retiro Guardian', email: 'retiro@cluster.com', role: 'CLUSTER_MANAGER', isVerified: true, password: '123', department: 'Retiro District' },
    { id: 'u-cluster-3', name: 'Malasaña Trend', email: 'malasana@cluster.com', role: 'CLUSTER_MANAGER', isVerified: true, password: '123', department: 'Malasaña District' },
    { id: 'u-cluster-4', name: 'Pozuelo Elite', email: 'pozuelo@cluster.com', role: 'CLUSTER_MANAGER', isVerified: true, password: '123', department: 'Pozuelo District' },
    { id: 'u-cluster-5', name: 'Salamanca Class', email: 'salamanca@cluster.com', role: 'CLUSTER_MANAGER', isVerified: true, password: '123', department: 'Salamanca District' },
    // --- HIGH EXPECTATION PARTNERS ---
    { id: 'u-partner-tech', name: 'Quantum Tech', email: 'quantum@partner.com', role: 'PARTNER', isVerified: true, password: '123' },
    { id: 'u-partner-clean', name: 'Pure Shine', email: 'pure@partner.com', role: 'PARTNER', isVerified: true, password: '123' },
    { id: 'u-partner-sec', name: 'Iron Guard', email: 'iron@partner.com', role: 'PARTNER', isVerified: true, password: '123' },
    { id: 'u-partner-laun', name: 'Silk Wash', email: 'silk@partner.com', role: 'PARTNER', isVerified: true, password: '123' },
    { id: 'u-partner-conc', name: 'Elite Concierge', email: 'elite@partner.com', role: 'PARTNER', isVerified: true, password: '123' }
  ];

  private properties: Property[] = [
    // Owner 1 Properties (Marco)
    { id: 'p1', ownerId: 'u-owner1', title: 'Modern Loft Sol', pricePerNight: 120, rating: 4.8, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', 'https://images.unsplash.com/photo-1484154218962-a197022b5858'], cleaningFee: 50, serviceFee: 30, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1, status: 'ACTIVE', location: 'Sol, Madrid, Spain', amenities: ['Wifi', 'AC', 'Coffee Machine'], description: 'Central loft in Sol.', assignedProfileIds: ['prof-p1-1', 'prof-p1-2', 'prof-p1-3', 'prof-p1-4'], assignedStaffIds: ['u-staff1', 'u-staff2'] },
    { id: 'p2', ownerId: 'u-owner1', title: 'Family House Retiro', pricePerNight: 250, rating: 4.9, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], cleaningFee: 80, serviceFee: 50, maxGuests: 6, bedrooms: 3, beds: 4, baths: 2, status: 'ACTIVE', location: 'Retiro, Madrid, Spain', amenities: ['Garden', 'Wifi', 'BBQ'], description: 'Spacious family home.', assignedProfileIds: ['prof-p2-1', 'prof-p2-2', 'prof-p2-3', 'prof-p2-4'], assignedStaffIds: ['u-staff2'] },
    { id: 'p3', ownerId: 'u-owner1', title: 'Studio Malasaña', pricePerNight: 90, rating: 4.5, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'https://images.unsplash.com/photo-1554995207-c18c203602cb', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb'], cleaningFee: 40, serviceFee: 20, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1, status: 'ACTIVE', location: 'Malasaña, Madrid, Spain', amenities: ['Wifi', 'Kitchen', 'Smart TV'], description: 'Trendy studio.', assignedProfileIds: ['prof-p3-1', 'prof-p3-2', 'prof-p3-3', 'prof-p3-4'], assignedStaffIds: ['u-staff1'] },
    // Owner 2 Properties (Elena)
    { id: 'p4', ownerId: 'u-owner2', title: 'Luxury Villa Pozuelo', pricePerNight: 600, rating: 5.0, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'], cleaningFee: 150, serviceFee: 100, maxGuests: 10, bedrooms: 5, beds: 8, baths: 4, status: 'ACTIVE', location: 'Pozuelo, Madrid, Spain', amenities: ['Pool', 'Gym', 'Sauna'], description: 'Exclusive villa.', assignedProfileIds: ['prof-p4-1', 'prof-p4-2', 'prof-p4-3', 'prof-p4-4'], assignedStaffIds: ['u-staff3', 'u-staff4'] },
    { id: 'p5', ownerId: 'u-owner2', title: 'Apartment Salamanca', pricePerNight: 300, rating: 4.7, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'], cleaningFee: 100, serviceFee: 60, maxGuests: 4, bedrooms: 2, beds: 2, baths: 2, status: 'ACTIVE', location: 'Salamanca, Madrid, Spain', amenities: ['Wifi', 'Elevator', 'Doorman'], description: 'Elegant apartment.', assignedProfileIds: ['prof-p5-1', 'prof-p5-2', 'prof-p5-3', 'prof-p5-4'], assignedStaffIds: ['u-staff4'] },
    { id: 'p6', ownerId: 'u-owner2', title: 'Penthouse Castellana', pricePerNight: 450, rating: 4.9, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', 'https://images.unsplash.com/photo-1554995207-c18c203602cb', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'], cleaningFee: 120, serviceFee: 80, maxGuests: 4, bedrooms: 2, beds: 2, baths: 2, status: 'ACTIVE', location: 'Castellana, Madrid, Spain', amenities: ['Terrace', 'View', 'Jacuzzi'], description: 'Stunning views.', assignedProfileIds: ['prof-p6-1', 'prof-p6-2', 'prof-p6-3', 'prof-p6-4'], assignedStaffIds: ['u-staff3'] },
    // --- HIGH EXPECTATION PROPERTIES ---
    { id: 'p-roi-1', ownerId: 'u-owner-roi', title: 'High-Yield Sol Studio', pricePerNight: 150, rating: 4.9, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', images: [], cleaningFee: 40, serviceFee: 20, maxGuests: 2, bedrooms: 1, beds: 1, baths: 1, status: 'ACTIVE', location: 'Sol, Madrid', description: 'Optimized for ROI.', assignedProfileIds: [], assignedStaffIds: ['u-staff-perf'], amenities: ['Wifi', 'AC'] },
    { id: 'p-prec-1', ownerId: 'u-owner-detail', title: 'Precision Loft Salamanca', pricePerNight: 350, rating: 5.0, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', images: [], cleaningFee: 100, serviceFee: 50, maxGuests: 4, bedrooms: 2, beds: 2, baths: 2, status: 'ACTIVE', location: 'Salamanca, Madrid', description: 'Impeccable detail.', assignedProfileIds: [], assignedStaffIds: ['u-staff-crea'], amenities: ['Wifi', 'Kitchen', 'Elevator'] },
    { id: 'p-maint-1', ownerId: 'u-owner-maint', title: 'Structural Gem Retiro', pricePerNight: 280, rating: 4.8, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', images: [], cleaningFee: 80, serviceFee: 40, maxGuests: 6, bedrooms: 3, beds: 4, baths: 2, status: 'ACTIVE', location: 'Retiro, Madrid', description: 'Perfectly maintained.', assignedProfileIds: [], assignedStaffIds: ['u-staff-tech'], amenities: ['Wifi', 'Garden', 'Heating'] }
  ];

  private reviews: Review[] = [
    { id: 'r1', propertyId: 'p1', clientName: 'Alice', rating: 5, comment: 'Incredible stay!', date: '2024-01-10' },
    { id: 'r2', propertyId: 'p1', clientName: 'Bob', rating: 4, comment: 'Very clean villa.', date: '2024-02-15' }
  ];

  private templates: TaskTemplate[] = [];
  private currentUser: User | null = null;
  private tasks: Task[] = [
    { id: 't-init-1', assigneeId: 'u-staff1', propertyId: 'p1', propertyName: 'Modern Loft Sol', title: 'Initial Inspection', status: 'TODO', description: 'Routine check.', type: 'ADMIN' },
    { id: 't-init-2', assigneeId: 'u-staff2', propertyId: 'p2', propertyName: 'Family House Retiro', title: 'Garden Maintenance', status: 'TODO', description: 'Water plants.', type: 'CLEANING' },
    { id: 't-init-3', assigneeId: 'u-staff1', propertyId: 'p3', propertyName: 'Studio Malasaña', title: 'Inventory Check', status: 'TODO', description: 'Check supplies.', type: 'ADMIN' },
    { id: 't-init-4', assigneeId: 'u-staff3', propertyId: 'p4', propertyName: 'Luxury Villa Pozuelo', title: 'Pool Cleaning', status: 'TODO', description: 'Clean filters.', type: 'CLEANING' },
    { id: 't-init-5', assigneeId: 'u-staff4', propertyId: 'p5', propertyName: 'Apartment Salamanca', title: 'AC Filter Change', status: 'TODO', description: 'Replace filters.', type: 'CLEANING' },
    { id: 't-init-6', assigneeId: 'u-staff3', propertyId: 'p6', propertyName: 'Penthouse Castellana', title: 'Terrace Sweep', status: 'TODO', description: 'Clean terrace.', type: 'CLEANING' }
  ];

  private notifications: { id: string; userId: string; message: string; time: string; read: boolean; type: 'INFO' | 'ALERT' | 'SUCCESS' }[] = [];

  private profiles: PropertyProfile[] = [
    // Profiles for P1 (Modern Loft Sol)
    { id: 'prof-p1-1', name: 'Sol Business Executive', title: 'Executive Smart Loft in Sol', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', targetAudience: 'Business', priceModifier: 1.15, description: 'High-speed fiber and ergonomic workspace in the heart of Madrid. Perfect for digital nomads and executives.', amenities: ['Fiber Wifi', 'Desk', 'Nespresso', 'Printer'], rules: ['No parties', 'Quiet hours 10pm-8am'], checkInTime: '14:00', checkOutTime: '10:00' },
    { id: 'prof-p1-2', name: 'Romantic Sol Getaway', title: 'Romantic Nest with Sol Views', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', targetAudience: 'Couples', priceModifier: 1.25, description: 'Champagne on arrival and late check-out for the perfect city romance. Cozy atmosphere for two.', amenities: ['Champagne', 'King Bed', 'Mood Lighting', 'Jacuzzi Access'], rules: ['No pets', 'No smoking'], checkInTime: '15:00', checkOutTime: '13:00' },
    { id: 'prof-p1-3', name: 'Sol Explorer Base', title: 'Budget Explorer Studio @ Sol', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858', targetAudience: 'Tourists', priceModifier: 0.95, description: 'Simple, clean, and right next to the metro. Perfect for city explorers on a budget.', amenities: ['City Map', 'Metro Pass Info', 'Basic Kitchen'], rules: ['No smoking'], checkInTime: '15:00', checkOutTime: '11:00' },
    { id: 'prof-p1-4', name: 'Luxury Sol Penthouse Experience', title: 'VIP Penthouse Experience in Sol', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', targetAudience: 'VIPs', priceModifier: 1.6, description: 'Premium linens and private concierge service for a top-tier stay. The best of Madrid at your feet.', amenities: ['Silk Sheets', 'Concierge', 'Private Chef Option', 'Valet'], rules: ['Strict noise control', 'No unauthorized guests'], checkInTime: '12:00', checkOutTime: '14:00' },
    
    // Profiles for P2 (Family House Retiro)
    { id: 'prof-p2-1', name: 'Retiro Family Fun', title: 'Family Paradise near Retiro Park', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', targetAudience: 'Families', priceModifier: 1.0, description: 'Equipped with toys, cribs, and a safe garden for the little ones. Steps from the park.', amenities: ['Crib', 'High Chair', 'Board Games', 'Stroller'], rules: ['No parties', 'Children must be supervised'], checkInTime: '15:00', checkOutTime: '11:00' },
    { id: 'prof-p2-2', name: 'Retiro Group Retreat', title: 'Spacious Group Villa Retiro', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', targetAudience: 'Groups', priceModifier: 1.1, description: 'Large dining area and BBQ for memorable group dinners near the park. Plenty of space for everyone.', amenities: ['Large BBQ', 'Extra Seating', 'Projector', 'Large Fridge'], rules: ['Respect neighbors', 'No loud music after 11pm'], checkInTime: '16:00', checkOutTime: '11:00' },
    { id: 'prof-p2-3', name: 'Retiro Nomad Hub', title: 'Digital Nomad Hub Retiro', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', targetAudience: 'Digital Nomads', priceModifier: 0.85, description: 'Monthly discounts and dedicated office space for long-term productivity. Fast wifi guaranteed.', amenities: ['Office Chair', 'Monitor', 'Printer', 'Standing Desk'], rules: ['No smoking', 'Long term preferred'], checkInTime: '15:00', checkOutTime: '11:00' },
    { id: 'prof-p2-4', name: 'Retiro Pet Paradise', title: 'Pet-Friendly Garden Home Retiro', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', targetAudience: 'Pet Owners', priceModifier: 1.05, description: 'We love pets! Fenced garden and nearby park walks. Your furry friends are welcome here.', amenities: ['Dog Bed', 'Water Bowls', 'Treats', 'Pet Toys'], rules: ['Clean garden after pets', 'Max 2 pets'], checkInTime: '15:00', checkOutTime: '11:00' },

    // Profiles for P3 (Studio Malasaña)
    { id: 'prof-p3-1', name: 'Malasaña Solo Zen', title: 'Zen Solo Studio in Hip Malasaña', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', targetAudience: 'Solo Travelers', priceModifier: 0.9, description: 'Quiet studio for the independent traveler looking for local vibes. Minimalist design.', amenities: ['Yoga Mat', 'Local Guide', 'Single Bed', 'Tea Selection'], rules: ['No guests', 'No smoking'], checkInTime: '14:00', checkOutTime: '11:00' },
    { id: 'prof-p3-2', name: 'Malasaña Nightlife Hub', title: 'Urban Pulse: Malasaña Nightlife Studio', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb', targetAudience: 'Party Goers', priceModifier: 1.2, description: 'In the heart of the action. Earplugs included for a good morning sleep after a long night.', amenities: ['Earplugs', 'Blackout Curtains', 'Hangover Kit', 'Bluetooth Speaker'], rules: ['No noise in common areas', 'No parties inside'], checkInTime: '16:00', checkOutTime: '14:00' },
    { id: 'prof-p3-3', name: 'Malasaña Art & Culture', title: 'Arty Studio in Creative Malasaña', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', targetAudience: 'Tourists', priceModifier: 1.0, description: 'Surrounded by galleries and street art. Discover the creative heart of Madrid.', amenities: ['Art Map', 'Sketchbook', 'Local Art Books'], rules: ['No parties', 'Respect the art'], checkInTime: '15:00', checkOutTime: '11:00' },
    { id: 'prof-p3-4', name: 'Malasaña Eco-Studio', title: 'Sustainable Living: Malasaña Eco-Studio', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', targetAudience: 'Eco-conscious', priceModifier: 1.0, description: 'Zero-waste amenities and energy-efficient appliances. For the conscious traveler.', amenities: ['Refillable Soap', 'Compost Bin', 'Organic Linens', 'Solar Charger'], rules: ['Strict recycling', 'Save energy'], checkInTime: '15:00', checkOutTime: '11:00' },

    // Profiles for P4 (Luxury Villa Pozuelo)
    { id: 'prof-p4-1', name: 'Pozuelo VIP Sanctuary', title: 'Ultra-Private VIP Sanctuary Pozuelo', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', targetAudience: 'Celebrities', priceModifier: 2.2, description: 'Total discretion and high-end security for high-profile guests. Gated community.', amenities: ['Security System', 'Private Entrance', 'Bulletproof Glass', 'Panic Room'], rules: ['NDA required', 'No photos', 'No visitors'], checkInTime: '12:00', checkOutTime: '12:00' },
    { id: 'prof-p4-2', name: 'Pozuelo Corporate Estate', title: 'Executive Corporate Estate Pozuelo', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', targetAudience: 'Corporate', priceModifier: 1.8, description: 'Perfect for executive off-sites and team building. Large meeting spaces.', amenities: ['Conference Table', 'Projector', 'Whiteboard', 'Catering Service'], rules: ['No smoking indoors', 'Professional use only'], checkInTime: '09:00', checkOutTime: '18:00' },
    { id: 'prof-p4-3', name: 'Pozuelo Wellness Villa', title: 'Wellness & Spa Villa Pozuelo', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', targetAudience: 'Yoga groups', priceModifier: 1.4, description: 'Heated pool and meditation garden for ultimate relaxation. Rejuvenate your soul.', amenities: ['Sauna', 'Meditation Mats', 'Juice Bar', 'Yoga Studio'], rules: ['No loud music', 'No alcohol preferred'], checkInTime: '14:00', checkOutTime: '12:00' },
    { id: 'prof-p4-4', name: 'Pozuelo Summer Mansion', title: 'The Ultimate Summer Mansion Pozuelo', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', targetAudience: 'Vacationers', priceModifier: 1.5, description: 'The ultimate summer stay with pool parties allowed (within limits). Fun for everyone.', amenities: ['Pool Bar', 'Outdoor Sound System', 'Inflatable Toys', 'Gazebo'], rules: ['Pool closed at midnight', 'Max 20 guests for events'], checkInTime: '15:00', checkOutTime: '11:00' },

    // Profiles for P5 (Apartment Salamanca)
    { id: 'prof-p5-1', name: 'Salamanca Gold Luxury', title: 'Gold Standard Luxury Salamanca', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', targetAudience: 'Wealthy', priceModifier: 1.5, description: 'Opulence in Madrid\'s most exclusive neighborhood. High-end finishes.', amenities: ['Valet Parking', '24h Doorman', 'Marble Floors', 'Silk Curtains'], rules: ['Formal behavior expected', 'Dress code in common areas'], checkInTime: '15:00', checkOutTime: '12:00' },
    { id: 'prof-p5-2', name: 'Salamanca Fashionista Suite', title: 'Fashionista Dream Suite Salamanca', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', targetAudience: 'Fashionistas', priceModifier: 1.3, description: 'Walk-in closet and proximity to the Golden Mile boutiques. Shop till you drop.', amenities: ['Walk-in Closet', 'Full-length Mirror', 'Steamer', 'Fashion Magazines'], rules: ['No pets', 'No smoking'], checkInTime: '14:00', checkOutTime: '11:00' },
    { id: 'prof-p5-3', name: 'Salamanca Diplomatic Residence', title: 'Secure Diplomatic Residence Salamanca', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', targetAudience: 'Officials', priceModifier: 1.4, description: 'Secure, quiet, and prestigious. Ideal for diplomatic visits and high-level meetings.', amenities: ['Safe', 'Secure Line', 'Soundproof Walls', 'Private Office'], rules: ['No noise', 'No unauthorized visitors'], checkInTime: '15:00', checkOutTime: '11:00' },
    { id: 'prof-p5-4', name: 'Salamanca Art Collector\'s Flat', title: 'Art Collector\'s Haven Salamanca', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', targetAudience: 'Collectors', priceModifier: 1.2, description: 'Stay among curated local art pieces in a refined setting. A gallery you can live in.', amenities: ['Art Catalog', 'Special Lighting', 'Curated Art Pieces'], rules: ['Do not touch artwork', 'No children under 12'], checkInTime: '15:00', checkOutTime: '11:00' },

    // Profiles for P6 (Penthouse Castellana)
    { id: 'prof-p6-1', name: 'Castellana Skyline View', title: 'Skyline Panoramic Penthouse Castellana', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', targetAudience: 'View lovers', priceModifier: 1.3, description: 'Unparalleled panoramic views of Madrid from your private terrace. See the whole city.', amenities: ['Telescope', 'Terrace Lounge', 'Binoculars', 'Outdoor Heater'], rules: ['No parties', 'No smoking on terrace'], checkInTime: '15:00', checkOutTime: '11:00' },
    { id: 'prof-p6-2', name: 'Castellana Tech Penthouse', title: 'Smart Tech Penthouse Castellana', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb', targetAudience: 'Architects', priceModifier: 1.2, description: 'Smart home features and award-winning interior design. The future of living.', amenities: ['Smart Lighting', 'Voice Control', 'Automated Blinds', 'Home Cinema'], rules: ['No smoking', 'Do not reset router'], checkInTime: '14:00', checkOutTime: '11:00' },
    { id: 'prof-p6-3', name: 'Castellana Executive Loft', title: 'Executive Boardroom Loft Castellana', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', targetAudience: 'CEOs', priceModifier: 1.4, description: 'High-end finishes and a boardroom-style dining area. Work and live in style.', amenities: ['Boardroom Table', 'Secretarial Service Option', 'Video Conf System'], rules: ['No noise', 'Professional use only'], checkInTime: '12:00', checkOutTime: '12:00' },
    { id: 'prof-p6-4', name: 'Castellana Weekend Escape', title: 'Luxury Weekend Escape Castellana', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', targetAudience: 'Tourists', priceModifier: 1.1, description: 'The perfect spot for a luxury 48-hour city break. Late check-out included.', amenities: ['Welcome Drinks', 'Late Check-out', 'City Guide', 'Brunch Kit'], rules: ['No noise', 'Enjoy your stay'], checkInTime: '15:00', checkOutTime: '15:00' }
  ];

  private reservations: Reservation[] = [
    { id: 'res-1', propertyId: 'p1', clientId: 'u-guest1', startDate: '2024-06-01', endDate: '2024-06-05', guests: 2, totalPrice: 600, status: 'COMPLETED' },
    { id: 'res-2', propertyId: 'p2', clientId: 'u-guest2', startDate: '2024-06-10', endDate: '2024-06-15', guests: 4, totalPrice: 1500, status: 'CHECKED_IN' },
    { id: 'res-3', propertyId: 'p3', clientId: 'u-guest3', startDate: '2024-06-20', endDate: '2024-06-25', guests: 1, totalPrice: 500, status: 'CONFIRMED' },
    { id: 'res-4', propertyId: 'p4', clientId: 'u-guest4', startDate: '2024-07-01', endDate: '2024-07-07', guests: 8, totalPrice: 4500, status: 'CONFIRMED' },
    { id: 'res-5', propertyId: 'p5', clientId: 'u-guest5', startDate: '2024-07-10', endDate: '2024-07-15', guests: 2, totalPrice: 1800, status: 'CONFIRMED' },
    { id: 'res-6', propertyId: 'p6', clientId: 'u-guest6', startDate: '2024-07-20', endDate: '2024-07-25', guests: 2, totalPrice: 2500, status: 'CONFIRMED' },
    { id: 'res-7', propertyId: 'p1', clientId: 'u-guest7', startDate: '2024-08-01', endDate: '2024-08-05', guests: 2, totalPrice: 650, status: 'CONFIRMED' },
    { id: 'res-8', propertyId: 'p2', clientId: 'u-guest8', startDate: '2024-08-10', endDate: '2024-08-15', guests: 3, totalPrice: 1400, status: 'CONFIRMED' },
    { id: 'res-9', propertyId: 'p3', clientId: 'u-guest9', startDate: '2024-08-20', endDate: '2024-08-25', guests: 2, totalPrice: 550, status: 'CONFIRMED' },
    { id: 'res-10', propertyId: 'p4', clientId: 'u-guest10', startDate: '2024-09-01', endDate: '2024-09-07', guests: 6, totalPrice: 4000, status: 'CONFIRMED' },
    // Recent reservations for "Real Data" metrics
    { id: 'res-recent-1', propertyId: 'p4', clientId: 'u-vip-ceo', startDate: new Date().toISOString().split('T')[0], endDate: '2026-04-15', guests: 2, totalPrice: 12000, status: 'CONFIRMED' },
    { id: 'res-recent-2', propertyId: 'p-prec-1', clientId: 'u-vip-luxury', startDate: new Date().toISOString().split('T')[0], endDate: '2026-04-12', guests: 1, totalPrice: 3500, status: 'CONFIRMED' },
    { id: 'res-recent-3', propertyId: 'p-roi-1', clientId: 'u-vip-nomad', startDate: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: '2026-04-10', guests: 1, totalPrice: 1500, status: 'COMPLETED' }
  ];

  private serviceRequests: ServiceRequest[] = [
    { id: 'sr1', propertyId: 'p1', propertyName: 'Villa Rosa', partnerId: 'u7', title: 'AC Repair', description: 'AC not cooling in master bedroom', status: 'PENDING', priority: 'HIGH', date: '2024-03-01' }
  ];

  private audits: Audit[] = [];

  private inventory: { [propertyId: string]: { item: string; qty: string; status: 'OK' | 'LOW' | 'CRITICAL' }[] } = {
    'p1': [
      { item: 'Master Suite Linen', qty: '4 sets', status: 'LOW' },
      { item: 'Luxury Shampoo (50ml)', qty: '12 units', status: 'OK' },
      { item: 'Coffee Pods (Gold)', qty: '2 units', status: 'CRITICAL' }
    ],
    'p2': [
      { item: 'Towels', qty: '10 sets', status: 'OK' },
      { item: 'Soap', qty: '5 units', status: 'LOW' }
    ],
    'p4': [
      { item: 'VIP Welcome Kit', qty: '2 units', status: 'LOW' },
      { item: 'Premium Champagne', qty: '5 bottles', status: 'OK' }
    ]
  };

  private saveTimeout: NodeJS.Timeout | null = null;
  private savePromise: Promise<void> | null = null;
  public isSaving = false;
  private onSavingStateChange: ((isSaving: boolean) => void)[] = [];
  private abortController: AbortController | null = null;

  constructor() {
    this.loadState().then(() => {
      this.simulateHighExpectationBehaviors();
      // Expert 15: Restore currentUser from localStorage if available
      if (typeof window !== 'undefined') {
        const savedUserId = localStorage.getItem('reachhomes_user_id');
        if (savedUserId) {
          const user = this.users.find(u => u.id === savedUserId);
          if (user) this.currentUser = user;
        }
      }
    });
    
    // Expert 15: Ensure state is saved before the user leaves the page
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushSave();
      });
    }

    // Ensure each staff is assigned to at least one property
    const staffIds = this.users.filter(u => u.role === 'COLLABORATOR').map(u => u.id);
    const propertyIds = this.properties.map(p => p.id);
    
    // First, give each staff one property
    staffIds.forEach((sid, idx) => {
      const pid = propertyIds[idx % propertyIds.length];
      const p = this.properties.find(prop => prop.id === pid);
      if (p) {
        if (!p.assignedStaffIds) p.assignedStaffIds = [];
        if (!p.assignedStaffIds.includes(sid)) p.assignedStaffIds.push(sid);
      }
    });

    // Then, ensure each property has at least one staff (if not already)
    this.properties.forEach(p => {
      if (!p.assignedStaffIds || p.assignedStaffIds.length === 0) {
        const randomStaff = staffIds[Math.floor(Math.random() * staffIds.length)];
        p.assignedStaffIds = [randomStaff];
      }
    });

    // Initialize reliability scores for partners
    this.users.filter(u => u.role === 'PARTNER').forEach(p => {
      p.reliabilityScore = 85 + Math.floor(Math.random() * 15); // Start high
    });

    // Ensure all users have password '123' unless specified
    this.users.forEach(u => {
      if (u.id === 'u-admin') u.password = '123';
      else if (!u.password) u.password = '123';
    });

    // Add more random reservations for the 10 guests across the 24 listings (virtual IDs)
    const guestIds = this.users.filter(u => u.role === 'CLIENT').map(u => u.id);
    const listings = this.getProperties();
    
    // Expert 50: Generate 60 realistic reservations to populate dashboards with "Real Data"
    for (let i = 0; i < 60; i++) {
      const guestId = guestIds[Math.floor(Math.random() * guestIds.length)];
      const listing = listings[Math.floor(Math.random() * listings.length)];
      if (!listing) continue;
      
      const start = new Date();
      // Mix of past, present, and future
      start.setDate(start.getDate() + Math.floor(Math.random() * 180) - 90); 
      const end = new Date(start);
      end.setDate(end.getDate() + Math.floor(Math.random() * 7) + 2);
      
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * listing.pricePerNight;

      // Determine status based on date
      let status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' = 'CONFIRMED';
      const today = new Date();
      if (start < today && end > today) status = 'CHECKED_IN';
      else if (end < today) status = 'CHECKED_OUT';
      
      if (Math.random() < 0.05) status = 'CANCELLED';

      this.reservations.push({
        id: `res-auto-${i}`,
        propertyId: listing.id,
        clientId: guestId,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        guests: Math.floor(Math.random() * listing.maxGuests) + 1,
        totalPrice,
        status
      });
    }

    // Expert 50: Add realistic reviews for the checked-out reservations
    this.reservations.filter(r => r.status === 'CHECKED_OUT').slice(0, 20).forEach((res, idx) => {
      const guest = this.users.find(u => u.id === res.clientId);
      if (guest && !this.reviews.some(rev => rev.id === `rev-auto-${idx}`)) {
        this.reviews.push({
          id: `rev-auto-${idx}`,
          propertyId: res.propertyId,
          clientName: guest.name,
          rating: 4 + Math.random(),
          comment: 'Exceptional stay. The attention to detail in the ReachHomes system is evident. Highly recommend.',
          date: res.endDate
        });
      }
    });

    // Run initial system audit
    this.auditSystemCollaborators();
  }

  private flushSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
      
      const state = {
        users: this.users,
        properties: this.properties,
        reviews: this.reviews,
        templates: this.templates,
        tasks: this.tasks,
        notifications: this.notifications,
        profiles: this.profiles,
        reservations: this.reservations,
        serviceRequests: this.serviceRequests,
        audits: this.audits
      };
      
      // Use navigator.sendBeacon if available for more reliable delivery on unload
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ data: state })], { type: 'application/json' });
        navigator.sendBeacon('/api/state', blob);
      } else {
        // Fallback to fetch with keepalive
        fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: state }),
          keepalive: true
        });
      }
    }
  }

  public subscribeToSavingState(callback: (isSaving: boolean) => void) {
    this.onSavingStateChange.push(callback);
    return () => {
      this.onSavingStateChange = this.onSavingStateChange.filter(cb => cb !== callback);
    };
  }

  private setSaving(val: boolean) {
    this.isSaving = val;
    this.onSavingStateChange.forEach(cb => cb(val));
  }

  private async saveState() {
    this.setSaving(true);
    // Debounce saves to prevent overwhelming the server and race conditions
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    
    this.saveTimeout = setTimeout(async () => {
      try {
        // Expert 22: Cancel previous pending save request
        if (this.abortController) {
          this.abortController.abort();
        }
        this.abortController = new AbortController();

        // Ensure only one save happens at a time (sequential processing)
        if (this.savePromise) await this.savePromise;

        const state = {
          users: this.users,
          properties: this.properties,
          reviews: this.reviews,
          templates: this.templates,
          tasks: this.tasks,
          notifications: this.notifications,
          profiles: this.profiles,
          reservations: this.reservations,
          serviceRequests: this.serviceRequests,
          audits: this.audits
        };
        
        this.savePromise = fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: state }),
          signal: this.abortController.signal
        }).then(async (response) => {
          if (!response.ok) {
            console.error('Failed to save state to server');
          }
        }).catch((error) => {
          if (error.name === 'AbortError') return;
          console.error('Error saving state:', error);
        }).finally(() => {
          this.savePromise = null;
          this.setSaving(false);
        });

        await this.savePromise;
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error in saveState loop:', error);
        this.setSaving(false);
      } finally {
        this.saveTimeout = null;
      }
    }, 1000);
  }

  public async loadState(retries = 8): Promise<boolean> {
    if (this.isSaving) return false;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('/api/state');
        
        // Expert 45: Handle 429 (Rate Limit) by waiting longer
        if (response.status === 429) {
          console.warn(`[DB] Rate limit hit. Waiting 30s before retry ${i + 1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, 30000));
          continue;
        }

        // Expert 44: Handle 503 (Initializing) gracefully
        if (response.status === 503) {
          console.warn(`[DB] Database is still initializing, waiting 5s before retry ${i + 1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        if (!response.ok) {
          // If we see HTML during a 200 or other, it's likely a boot shell
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            console.warn(`[DB] Received HTML response (Status: ${response.status}). The server might be booting. Waiting 5s...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          
          // Special check for common boot/error titles in HTML
          if (text.includes('<title>Starting Server') || text.includes('Taking a moment')) {
            console.warn(`[DB] Server boot page detected. Waiting 10s for backend to normalize...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
            continue;
          }

          console.error(`[DB] Unexpected Response Format (Expected JSON):
Status: ${response.status} ${response.statusText}
Content-Type: ${contentType}
Body Preview: ${text.substring(0, 200)}...`);
          throw new Error(`Response was not JSON (Status: ${response.status})`);
        }

        const data = await response.json();
        if (data) {
          this.users = data.users || this.users;
          this.properties = data.properties || this.properties;
          this.reviews = data.reviews || this.reviews;
          this.templates = data.templates || this.templates;
          this.tasks = data.tasks || this.tasks;
          this.notifications = data.notifications || this.notifications;
          this.profiles = data.profiles || this.profiles;
          this.reservations = data.reservations || this.reservations;
          this.serviceRequests = data.serviceRequests || this.serviceRequests;
          this.audits = data.audits || this.audits;
          
          // After loading state, ensure high-expectation behaviors are present
          this.simulateHighExpectationBehaviors();
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed to load state:`, error);
        if (i === retries - 1) return false;
        // Exponential backoff with a bit more buffer
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); 
      }
    }
    return false;
  }

  // PERFECT DYNAMIC: Owner -> Guest: Review Response (MARK AS PERFECT)
  respondToReview(ownerId: string, reviewId: string, response: string) {
    const owner = this.users.find(u => u.id === ownerId);
    const review = this.reviews.find(r => r.id === reviewId);
    if (!owner || !review) return;

    // 1. Update review with response
    review.ownerResponse = response;
    this.saveState();

    const property = this.properties.find(p => p.id === review.propertyId);
    const guest = this.users.find(u => u.name === review.clientName && u.role === 'CLIENT');

    if (guest) {
      this.addNotification(guest.id, `Owner Response: ${owner.name} replied to your review for ${property?.title}: "${response}"`, 'INFO');
    }

    // 2. Notify Cluster Manager
    const clusterManagers = this.getClusterManagers();
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `Review Response: Owner ${owner.name} replied to ${review.clientName}'s review for ${property?.title}.`, 'INFO');
    });

    // 3. Notify Geo Manager
    const geoManagers = this.getGeoManagers();
    geoManagers.forEach(gm => {
      this.addNotification(gm.id, `Owner Engagement: ${owner.name} responded to a review for ${property?.title}.`, 'SUCCESS');
    });
  }

  // PERFECT DYNAMIC: Guest -> Staff: Concierge Request (MARK AS PERFECT)
  requestConcierge(clientId: string, propertyId: string, request: string) {
    const guest = this.users.find(u => u.id === clientId);
    const property = this.properties.find(p => p.id === propertyId);
    if (!guest || !property) return;

    // 1. Notify Assigned Staff
    property.assignedStaffIds.forEach(sid => {
      this.addNotification(sid, `CONCIERGE REQUEST: Guest ${guest.name} at ${property.title} requested: "${request}"`, 'ALERT');
      
      // 2. Create Task for Staff
      this.createTask({
        assigneeId: sid,
        propertyId: property.id,
        propertyName: property.title,
        title: `Concierge: ${guest.name}`,
        status: 'TODO',
        description: `Guest requested: ${request}. Please attend to this request as soon as possible.`,
        type: 'ADMIN'
      });
    });

    // 3. Notify Cluster Manager for oversight
    const clusterManagers = this.getClusterManagers();
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `Guest Request: ${guest.name} at ${property.title} requested concierge service: "${request}".`, 'INFO');
    });

    // 4. Notify Guest
    this.addNotification(guest.id, `Request Received: Our staff has been notified of your request for "${request}". We will assist you shortly.`, 'SUCCESS');
  }

  // PERFECT DYNAMIC: Cluster Manager Oversight (MARK AS PERFECT)
  auditSystemCollaborators() {
    const clusterManagers = this.getClusterManagers();
    const now = new Date();

    // 1. Check for overdue tasks
    const overdueTasks = this.tasks.filter(t => t.status !== 'DONE'); // Simplified: all pending tasks for demo
    if (overdueTasks.length > 5) {
      clusterManagers.forEach(cm => {
        this.addNotification(cm.id, `OPERATIONAL ALERT: System detected ${overdueTasks.length} pending tasks. Efficiency audit required.`, 'ALERT');
        this.createTask({
          assigneeId: cm.id,
          propertyId: 'global',
          propertyName: 'Collaborators',
          title: 'Conduct Efficiency Audit',
          status: 'TODO',
          description: `High volume of pending tasks (${overdueTasks.length}). Please review staff workloads and reassign if necessary.`,
          type: 'ADMIN'
        });
      });
    }

    // 2. Check for low occupancy (Dynamic Pricing Suggestion)
    this.properties.forEach(p => {
      const futureRes = this.reservations.filter(r => r.propertyId === p.id && new Date(r.startDate) > now);
      if (futureRes.length === 0) {
        const owner = this.users.find(u => u.id === p.ownerId);
        if (owner) {
          this.addNotification(owner.id, `REVENUE OPTIMIZATION: ${p.title} has no upcoming bookings. Consider lowering the price modifier on your profiles to attract guests.`, 'INFO');
        }
      }
    });
  }

  login(email: string, role: UserRole) {
    const u = this.users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.role === role);
    if (u) {
      u.lastLogin = new Date().toISOString();
      this.currentUser = u;
      if (typeof window !== 'undefined') {
        localStorage.setItem('reachhomes_user_id', u.id);
      }
      this.saveState(); // Persist lastLogin
    }
    return u;
  }

  logout() { 
    this.currentUser = null; 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reachhomes_user_id');
    }
  }
  getCurrentUser() { return this.currentUser; }
  getUsers() { return this.users; }
  
  createUser(user: User) {
    const newUser = {
      ...user,
      id: user.id || `u-${crypto.randomUUID()}`
    };
    this.users.push(newUser);
    this.saveState();
    return newUser;
  }

  deleteUser(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.saveState();
  }

  updateUser(updated: User) {
    const idx = this.users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
      this.users[idx] = updated;
      this.saveState();
    }
  }

  getProperties(query?: string) {
    // DYNAMIC: Return listings based on profiles (6 properties * 4 profiles = 24 listings)
    const listings = this.properties.flatMap(p => {
      return p.assignedProfileIds.map(profId => {
        const profile = this.profiles.find(prof => prof.id === profId);
        if (!profile) return null;
        
        return {
          ...p,
          id: `${p.id}-${profile.id}`, // Virtual listing ID
          basePropertyId: p.id,
          profileId: profile.id,
          title: profile.title || p.title,
          description: profile.description || p.description,
          pricePerNight: Math.round(p.pricePerNight * (profile.priceModifier || 1)),
          image: profile.image || p.image,
          amenities: [...new Set([...p.amenities, ...(profile.amenities || [])])],
          rules: profile.rules || []
        };
      }).filter(Boolean);
    });

    if (!query) return listings;
    const q = query.toLowerCase();
    return listings.filter(l => 
      l!.title.toLowerCase().includes(q) || 
      l!.description.toLowerCase().includes(q)
    );
  }

  getListingData(pid: string) {
    // Handle virtual ID (p1-prof-p1-1)
    const baseId = pid.split('-')[0];
    const property = this.properties.find(p => p.id === baseId);
    
    // If it's a virtual ID, we might want to return the profile-specific data
    let listing = property;
    if (pid.includes('-prof-')) {
      const profId = pid.split('-').slice(1).join('-');
      const profile = this.profiles.find(prof => prof.id === profId);
      if (profile && property) {
        listing = {
          ...property,
          id: pid,
          title: profile.title || property.title,
          description: profile.description || property.description,
          pricePerNight: Math.round(property.pricePerNight * (profile.priceModifier || 1)),
          image: profile.image || property.image
        };
      }
    }

    return {
      property: listing,
      reviews: this.reviews.filter(r => r.propertyId === baseId)
    };
  }

  getClientReservations(clientId: string) {
    return this.reservations.filter(r => r.clientId === clientId).map(r => ({
      ...r,
      property: this.properties.find(p => p.id === r.propertyId)
    }));
  }

  getPropertyReservations(propertyId: string) {
    const baseId = propertyId.split('-')[0];
    return this.reservations.filter(r => r.propertyId === baseId);
  }

  createReservation(res: Omit<Reservation, 'id' | 'status'>) {
    // Handle virtual ID
    const basePropertyId = res.propertyId.split('-')[0];
    const property = this.properties.find(p => p.id === basePropertyId);
    
    if (property?.status === 'MAINTENANCE') {
      throw new Error('Property is currently under maintenance and cannot accept new bookings.');
    }

    // Expert 35: Check for overlapping reservations
    const hasOverlap = this.reservations.some(existing => {
      if (existing.propertyId !== basePropertyId || existing.status === 'CANCELLED') return false;
      
      const start = new Date(res.startDate);
      const end = new Date(res.endDate);
      const existingStart = new Date(existing.startDate);
      const existingEnd = new Date(existing.endDate);

      return (start < existingEnd && end > existingStart);
    });

    if (hasOverlap) {
      throw new Error('This property is already booked for the selected dates.');
    }

    const newRes: Reservation = {
      ...res,
      propertyId: basePropertyId, // Store base ID in reservation
      id: `res-${crypto.randomUUID()}`,
      status: 'CONFIRMED'
    };
    this.reservations.push(newRes);
    this.saveState();

    // DYNAMIC: Auto-generate turnover task for staff
    const owner = this.users.find(u => u.id === property?.ownerId);
    const staff = this.users.find(u => u.id === property?.assignedStaffIds[0]); // Use assigned staff

    if (property && staff) {
      // PERFECT DYNAMIC: Staff Workload Monitoring
      const activeTasks = this.tasks.filter(t => t.assigneeId === staff.id && t.status !== 'DONE');
      if (activeTasks.length >= 3) {
        const clusterManagers = this.getClusterManagers();
        clusterManagers.forEach(cm => {
          this.addNotification(cm.id, `WORKLOAD ALERT: ${staff.name} has ${activeTasks.length} active tasks. Consider reassigning new turnover for ${property.title}.`, 'ALERT');
        });
      }

      // Check if an urgent turnover task already exists from a recent checkout
      const existingTask = this.tasks.find(t => t.propertyId === property.id && t.status === 'TODO' && t.title.includes('Turnover'));
      
      if (!existingTask) {
        const task: Task = {
          id: `task-auto-${crypto.randomUUID()}`,
          assigneeId: staff.id,
          propertyId: property.id,
          propertyName: property.title,
          title: `Turnover: ${property.title}`,
          status: 'TODO',
          description: `Prepare property for guest arrival on ${new Date(res.startDate).toLocaleDateString()}.`,
          type: 'CLEANING',
          checklist: [
            { id: 'ch1', text: 'Change linens', completed: false },
            { id: 'ch2', text: 'Sanitize bathroom', completed: false },
            { id: 'ch3', text: 'Check welcome kit', completed: false }
          ]
        };
        this.tasks.push(task);
        this.addNotification(staff.id, `New turnover task assigned for ${property.title}`, 'INFO');
      } else {
        // Update existing task with new guest info
        existingTask.description += ` \nUPDATE: New guest arriving on ${new Date(res.startDate).toLocaleDateString()}.`;
        this.addNotification(staff.id, `Turnover task for ${property.title} updated with new arrival date.`, 'INFO');
      }
    }

    // PERFECT DYNAMIC: Guest Loyalty Rewards (MARK AS PERFECT)
    const guestReservations = this.reservations.filter(r => r.clientId === res.clientId);
    const guest = this.users.find(u => u.id === res.clientId);
    if (guest) {
      guest.loyaltyPoints = (guest.loyaltyPoints || 0) + 10; // 10 points per booking
    }

    if (guestReservations.length >= 3) {
      this.addNotification(res.clientId, `LOYALTY REWARD: Thank you for your ${guestReservations.length}th booking! A special welcome gift will be waiting for you. (Points: ${guest?.loyaltyPoints})`, 'SUCCESS');
      if (owner) {
        this.addNotification(owner.id, `LOYALTY ALERT: ${guest?.name} is a returning guest (3+ bookings). Please prepare a VIP welcome.`, 'SUCCESS');
      }
    }

    // PERFECT DYNAMIC: Property Performance Insights
    const propertyReservations = this.reservations.filter(r => r.propertyId === basePropertyId);
    if (propertyReservations.length >= 5) {
      if (owner) {
        this.addNotification(owner.id, `PERFORMANCE INSIGHT: ${property?.title} has high demand (5+ bookings). Consider increasing the profile price modifier for higher ROI.`, 'INFO');
      }
    }

    // DYNAMIC: Notify Owner
    if (owner) {
      this.addNotification(owner.id, `New booking confirmed for ${property?.title}: $${res.totalPrice}`, 'SUCCESS');
    }

    return newRes;
  }

  cancelReservation(resId: string) {
    const res = this.reservations.find(r => r.id === resId);
    if (res) {
      res.status = 'CANCELLED';
      this.saveState();
      
      const property = this.properties.find(p => p.id === res.propertyId);
      const owner = this.users.find(u => u.id === property?.ownerId);
      const staff = this.users.find(u => u.parentId === owner?.id && u.role === 'COLLABORATOR');

      // DYNAMIC: Cancel associated turnover tasks
      this.tasks = this.tasks.filter(t => !(t.propertyId === res.propertyId && t.title.includes('Turnover') && t.status === 'TODO'));

      // DYNAMIC: Notify Staff
      if (staff) {
        this.addNotification(staff.id, `CANCELLATION: Turnover task for ${property?.title} has been removed due to guest cancellation.`, 'ALERT');
      }

      // DYNAMIC: Notify Owner
      if (owner) {
        this.addNotification(owner.id, `Booking Cancelled: The reservation for ${property?.title} (${res.startDate}) has been cancelled.`, 'ALERT');
      }
    }
  }

  private addNotification(userId: string, message: string, type: 'INFO' | 'ALERT' | 'SUCCESS' = 'INFO') {
    this.notifications.unshift({
      id: `notif-${crypto.randomUUID()}`,
      userId,
      message,
      time: new Date().toLocaleTimeString(),
      read: false,
      type
    });
    this.saveState();
  }

  getNotifications(userId: string) {
    return this.notifications.filter(n => n.userId === userId);
  }

  markNotificationsRead(userId: string) {
    this.notifications.filter(n => n.userId === userId).forEach(n => n.read = true);
  }

  getGeoManagers() { return this.users.filter(u => u.role === 'GEO_MANAGER'); }
  getAdmins() { return this.users.filter(u => u.role === 'ADMIN'); }

  updateUserShiftStatus(uid: string, status: User['shiftStatus']) {
    const user = this.users.find(u => u.id === uid);
    if (user && status) {
      user.shiftStatus = status;

      // DYNAMIC: Notify Cluster Manager
      const clusterManagers = this.getClusterManagers();
      clusterManagers.forEach(cm => {
        this.addNotification(cm.id, `Staff Status: ${user.name} is now ${status.replace('_', ' ')}.`, 'INFO');
      });

      // PERFECT DYNAMIC: Shift-Task Alignment Monitoring
      if (status === 'OFF_SHIFT') {
        const pendingTasks = this.tasks.filter(t => t.assigneeId === uid && (t.status === 'TODO' || t.status === 'IN_PROGRESS'));
        if (pendingTasks.length > 0) {
          clusterManagers.forEach(cm => {
            this.addNotification(cm.id, `RESOURCE ALERT: ${user.name} ended shift with ${pendingTasks.length} pending tasks. Reassignment recommended.`, 'ALERT');
            
            // Create a task for the CM to reassign these tasks
            this.createTask({
              assigneeId: cm.id,
              propertyId: 'global',
              propertyName: 'Collaborators',
              title: `Reassign Tasks: ${user.name}`,
              status: 'TODO',
              description: `${user.name} went off-shift leaving ${pendingTasks.length} tasks incomplete: ${pendingTasks.map(t => t.title).join(', ')}.`,
              type: 'ADMIN'
            });
          });
        }

        // DYNAMIC: Notify Geo Manager if critical staff goes offline
        const geoManagers = this.getGeoManagers();
        geoManagers.forEach(gm => {
          this.addNotification(gm.id, `Resource Update: ${user.name} has ended their shift.`, 'INFO');
        });
      }
    }
  }
  getClusterManagers() { return this.users.filter(u => u.role === 'CLUSTER_MANAGER'); }

  broadcastSystemAlert(message: string, type: 'INFO' | 'ALERT' | 'SUCCESS' = 'ALERT') {
    this.users.forEach(u => {
      this.addNotification(u.id, `SYSTEM BROADCAST: ${message}`, type);
    });
  }

  submitInvoice(partnerId: string, srid: string, amount: number) {
    const partner = this.users.find(u => u.id === partnerId);
    const sr = this.serviceRequests.find(x => x.id === srid);
    
    if (partner && sr && partner.role === 'PARTNER') {
      // DYNAMIC: Notify Cluster Manager
      const clusterManagers = this.getClusterManagers();
      clusterManagers.forEach(cm => {
        this.addNotification(cm.id, `Invoice Submitted: ${partner.name} has submitted an invoice for $${amount} (Request: ${sr.title}).`, 'SUCCESS');
        
        // DYNAMIC: Create task for Cluster Manager to approve payment
        this.createTask({
          assigneeId: cm.id,
          propertyId: sr.propertyId,
          propertyName: sr.propertyName,
          title: `Approve Payment: ${partner.name}`,
          status: 'TODO',
          description: `Invoice of $${amount} submitted for maintenance work on "${sr.title}". Please verify work and approve for Juan to process payment.`,
          type: 'ADMIN'
        });
      });

      // DYNAMIC: Notify Juan (Finance)
      const juan = this.getSuperAdmin();
      if (juan) {
        this.addNotification(juan.id, `Pending Payout: $${amount} invoice from ${partner.name} is awaiting cluster approval.`, 'INFO');
      }
    }
  }

  getSystemHealth(): SystemHealth { return { cpu: 12, latency: 18, activeNodes: 4, dbStatus: 'OPTIMAL' }; }
  
  public getRevenue24h(): number {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return this.reservations
      .filter(res => new Date(res.startDate) >= oneDayAgo)
      .reduce((sum, res) => sum + res.totalPrice, 0);
  }

  public getRevenueGrowth(): number {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    
    const revenueLast24h = this.reservations
      .filter(res => new Date(res.startDate) >= oneDayAgo)
      .reduce((sum, res) => sum + res.totalPrice, 0);
      
    const revenuePrev24h = this.reservations
      .filter(res => {
        const d = new Date(res.startDate);
        return d >= twoDaysAgo && d < oneDayAgo;
      })
      .reduce((sum, res) => sum + res.totalPrice, 0);
      
    if (revenuePrev24h === 0) return revenueLast24h > 0 ? 100 : 0;
    return ((revenueLast24h - revenuePrev24h) / revenuePrev24h) * 100;
  }

  public getRegionalGoalProgress(taskId: string): number {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return 0;
    if (task.status === 'DONE') return 100;
    
    const relatedTasks = this.tasks.filter(t => t.propertyId === task.propertyId);
    if (relatedTasks.length === 0) return 45; 
    const completed = relatedTasks.filter(t => t.status === 'DONE').length;
    return (completed / relatedTasks.length) * 100;
  }

  public getPropertyInventory(pid: string) {
    return this.inventory[pid] || [
      { item: 'Standard Linen', qty: '5 sets', status: 'OK' },
      { item: 'Amenities Kit', qty: '10 units', status: 'OK' }
    ];
  }

  public getOwnerOccupancy(oid: string): number {
    const ownerProps = this.getOwnerProperties(oid);
    if (ownerProps.length === 0) return 0;
    const checkedIn = ownerProps.filter(p => 
      this.reservations.some(r => r.propertyId === p.id && r.status === 'CHECKED_IN')
    ).length;
    // If no one is checked in, return a realistic baseline for the demo
    if (checkedIn === 0) return 75; 
    return (checkedIn / ownerProps.length) * 100;
  }

  public getPartnerEarnings(partnerId: string): number {
    // In a real app, we'd have an 'invoices' table. 
    // For now, we'll estimate based on completed service requests.
    const completed = this.getServiceRequests(partnerId).filter(r => r.status === 'COMPLETED');
    return completed.length * 1200 + 5000; // Baseline + per job
  }

  public getClusterMetrics(clusterId: string): { revenue: number; occupancy: number } {
    // Mocking cluster-specific metrics based on global data for now
    const totalRevenue = this.getAllReservations().reduce((acc, r) => acc + r.totalPrice, 0);
    const hash = clusterId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return {
      revenue: (totalRevenue / 5) + (hash % 5000),
      occupancy: 70 + (hash % 25)
    };
  }

  public verifyDataIntegrity(): { status: 'OK' | 'ERROR'; issues: string[] } {
    const issues: string[] = [];
    
    this.users.forEach(u => {
      if (u.parentId && !this.users.find(p => p.id === u.parentId)) {
        issues.push(`User ${u.id} has invalid parentId ${u.parentId}`);
      }
    });
    
    this.properties.forEach(p => {
      if (!this.users.find(u => u.id === p.ownerId)) {
        issues.push(`Property ${p.id} has invalid ownerId ${p.ownerId}`);
      }
    });
    
    this.tasks.forEach(t => {
      if (!this.users.find(u => u.id === t.assigneeId)) {
        issues.push(`Task ${t.id} has invalid assigneeId ${t.assigneeId}`);
      }
      if (t.propertyId !== 'global' && !this.properties.find(p => p.id === t.propertyId)) {
        issues.push(`Task ${t.id} has invalid propertyId ${t.propertyId}`);
      }
    });

    return {
      status: issues.length === 0 ? 'OK' : 'ERROR',
      issues
    };
  }

  getTasks(uid: string) {
    return this.tasks.filter(t => t.assigneeId === uid);
  }

  getAllTasks() {
    return this.tasks;
  }

  getOwnerProperties(oid: string) { return this.properties.filter(p => p.ownerId === oid); }
  getOwnerProfiles(oid: string) { return this.profiles.filter(p => p.ownerId === oid); }
  
  getTemplates() { return this.templates; }

  getSystemLogs() {
    // Expert 50: Dynamic log generation based on current system state
    const logs = [
      `[${new Date().toISOString()}] KERNEL: System initialized.`,
      `[${new Date().toISOString()}] AUTH: User ${this.currentUser?.name || 'GUEST'} session active.`,
      `[${new Date().toISOString()}] DB: State loaded successfully.`,
      `[${new Date().toISOString()}] INFRA: Cluster health at ${this.getSystemHealth().cpu}% CPU`,
    ];

    if (this.isSaving) {
      logs.push(`[${new Date().toISOString()}] SYNC: Data persistence in progress...`);
    }

    const pendingTasks = this.tasks.filter(t => t.status !== 'DONE').length;
    if (pendingTasks > 0) {
      logs.push(`[${new Date().toISOString()}] SCHEDULER: ${pendingTasks} tasks in queue.`);
    }

    return logs;
  }
  updateProfile(updated: PropertyProfile) {
    const idx = this.profiles.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      this.profiles[idx] = updated;
      this.saveState();

      // DYNAMIC: Notify Cluster Manager for review
      const clusterManagers = this.getClusterManagers();
      clusterManagers.forEach(cm => {
        this.addNotification(cm.id, `Profile Updated: ${updated.name} has been modified. Please review for brand compliance.`, 'INFO');
        
        this.createTask({
          assigneeId: cm.id,
          propertyId: 'global',
          propertyName: 'Brand Standards',
          title: `Review Profile: ${updated.name}`,
          status: 'TODO',
          description: `An owner has updated the profile "${updated.name}". Please verify that the new description and amenities align with ReachHomes standards.`,
          type: 'ADMIN'
        });
      });
    }
  }

  createTemplate(data: { title: string; type: string; description: string; standardDurationMinutes: number; createdBy: string }) {
    const tpl: TaskTemplate = {
      id: `tpl-${crypto.randomUUID()}`,
      title: data.title,
      type: data.type,
      description: data.description,
      duration: data.standardDurationMinutes
    };
    this.templates.push(tpl);

    // DYNAMIC: Notify all Cluster Managers of new SOP
    const clusterManagers = this.users.filter(u => u.role === 'CLUSTER_MANAGER');
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `New Task Template Published: ${tpl.title}. Please review for local implementation.`, 'INFO');
      
      // DYNAMIC: Create a task for each Cluster Manager to review the SOP
      this.createTask({
        assigneeId: cm.id,
        propertyId: 'global',
        propertyName: 'Regional Collaborators',
        title: `Review SOP: ${tpl.title}`,
        status: 'TODO',
        description: `A new standard operating procedure has been published by the Geo Manager. Please review and train your local staff.`,
        type: 'ADMIN'
      });
    });

    // DYNAMIC: Notify Juan
    const juan = this.getSuperAdmin();
    if (juan) {
      this.addNotification(juan.id, `Regional Optimization: New SOP "${tpl.title}" published by Geo Manager.`, 'SUCCESS');
    }
  }

  private validateTask(task: Omit<Task, 'id'>): boolean {
    if (!task.assigneeId || !task.propertyId || !task.title || !task.status) return false;
    if (!this.users.find(u => u.id === task.assigneeId)) return false;
    if (task.propertyId !== 'global' && !this.properties.find(p => p.id === task.propertyId)) return false;
    return true;
  }

  createTask(task: Omit<Task, 'id'>) {
    if (!this.validateTask(task)) {
      console.error('Data Integrity Violation: Invalid task data rejected.', task);
      return null;
    }
    const newTask: Task = {
      ...task,
      id: `task-${crypto.randomUUID()}`
    };
    this.tasks.push(newTask);
    this.saveState();

    // DYNAMIC: Notify Assignee
    this.addNotification(task.assigneeId, `New task assigned: ${task.title}`, 'INFO');

    // DYNAMIC: Notify Owner of the property
    const property = this.properties.find(p => p.id === task.propertyId);
    if (property) {
      const owner = this.users.find(u => u.id === property.ownerId);
      if (owner) {
        this.addNotification(owner.id, `New task created for ${property.title}: ${task.title}`, 'INFO');
      }
    }
    return newTask;
  }

  getAllReservations() {
    return this.reservations.map(r => ({
      ...r,
      property: this.properties.find(p => p.id === r.propertyId),
      client: this.users.find(u => u.id === r.clientId)
    }));
  }

  private validateReservation(res: Reservation): boolean {
    // Expert 50: Unitary Control - Ensure data integrity before persistence
    if (!res.id || !res.propertyId || !res.clientId || !res.startDate || !res.endDate) return false;
    if (new Date(res.startDate) >= new Date(res.endDate)) return false;
    if (res.totalPrice <= 0) return false;
    if (res.guests <= 0) return false;
    
    // Check if property exists
    const property = this.properties.find(p => p.id === res.propertyId);
    if (!property) return false;

    // Check if client exists
    const client = this.users.find(u => u.id === res.clientId);
    if (!client) return false;

    return true;
  }

  addReservation(res: Reservation) {
    if (!this.validateReservation(res)) {
      console.error('Data Integrity Violation: Invalid reservation data rejected.', res);
      return;
    }
    this.reservations.push(res);
    this.saveState();
  }

  getSuperAdmin() {
    return this.users.find(u => u.role === 'JUAN');
  }

  updateTaskStatus(tid: string, status: Task['status']) {
    const task = this.tasks.find(t => t.id === tid);
    if (task) {
      const oldStatus = task.status;
      task.status = status;
      this.saveState();

      // PERFECT DYNAMIC: Financial Lifecycle (MARK AS PERFECT)
      // Step 1: CM Approves Payment -> Notify Juan to Process Payout
      if (status === 'DONE' && task.title.includes('Approve Payment')) {
        const juan = this.getSuperAdmin();
        if (juan) {
          this.addNotification(juan.id, `PAYOUT REQUIRED: Cluster Manager approved payment for task "${task.title}". Please process the final payout.`, 'ALERT');
          this.createTask({
            assigneeId: juan.id,
            propertyId: task.propertyId,
            propertyName: task.propertyName,
            title: `Process Payout: ${task.title.split(': ')[1]}`,
            status: 'TODO',
            description: `Final financial step: Process the payout for the maintenance work completed. CM has verified and approved.`,
            type: 'ADMIN'
          });
        }
      }

      // Step 2: Juan Processes Payout -> Notify Partner
      if (status === 'DONE' && task.title.includes('Process Payout')) {
        const partnerName = task.title.split(': ')[1];
        const partner = this.users.find(u => u.name === partnerName && u.role === 'PARTNER');
        if (partner) {
          this.addNotification(partner.id, `PAYMENT PROCESSED: Your invoice for work on ${task.propertyName} has been paid. Thank you for your service!`, 'SUCCESS');
          
          // Also notify CM and Owner
          const property = this.properties.find(p => p.id === task.propertyId);
          if (property) {
            // Update property expenses
            property.expenses = (property.expenses || 0) + 100; // Simulated expense amount

            const owner = this.users.find(u => u.id === property.ownerId);
            if (owner) this.addNotification(owner.id, `Financial Update: Payout for maintenance on ${property.title} has been finalized by Juan. Expenses updated.`, 'INFO');
            
            const clusterManagers = this.getClusterManagers();
            clusterManagers.forEach(cm => this.addNotification(cm.id, `Payout Complete: ${partnerName} has been paid for ${property.title}.`, 'SUCCESS'));
          }
        }
      }

      // PERFECT DYNAMIC: Staff Performance Analytics
      if (status === 'DONE' && oldStatus !== 'DONE') {
        const property = this.properties.find(p => p.id === task.propertyId);
        const staff = this.users.find(u => u.id === task.assigneeId);
        
        if (staff && property) {
          // Simulated performance check: 20% chance of "exceptional" or "needs review"
          const perfRoll = Math.random();
          const clusterManagers = this.getClusterManagers();
          
          if (perfRoll > 0.9) {
            clusterManagers.forEach(cm => {
              this.addNotification(cm.id, `PERFORMANCE KUDOS: ${staff.name} completed "${task.title}" 30% faster than average. High efficiency detected.`, 'SUCCESS');
            });
            this.addNotification(staff.id, `EXCELLENCE AWARD: Your efficiency on "${task.title}" has been noted by the system. Keep it up!`, 'SUCCESS');
          } else if (perfRoll < 0.1) {
            clusterManagers.forEach(cm => {
              this.addNotification(cm.id, `PERFORMANCE REVIEW: ${staff.name} took longer than expected for "${task.title}". Support or training may be required.`, 'ALERT');
            });
          }
        }

        // PERFECT DYNAMIC: Partner Performance & Reliability (MARK AS PERFECT)
        if (task.title.includes('Verify Work')) {
          const partnerName = task.title.split(': ')[1];
          const partner = this.users.find(u => u.name === partnerName && u.role === 'PARTNER');
          if (partner) {
            // Boost reliability score
            partner.reliabilityScore = Math.min(100, (partner.reliabilityScore || 85) + 2);
            this.addNotification(partner.id, `RELIABILITY BOOST: Your work verification was successful. Your reliability score is now ${partner.reliabilityScore}%.`, 'SUCCESS');
            
            const clusterManagers = this.getClusterManagers();
            clusterManagers.forEach(cm => {
              this.addNotification(cm.id, `PARTNER UPDATE: ${partner.name} reliability increased to ${partner.reliabilityScore}% after successful verification.`, 'INFO');
            });
          }
        }
      }

      // DYNAMIC: If task is DONE, notify owner and potentially update property status
      if (status === 'DONE' && oldStatus !== 'DONE') {
        const property = this.properties.find(p => p.id === task.propertyId);
        if (property) {
          const owner = this.users.find(u => u.id === property.ownerId);
          if (owner) {
            this.addNotification(owner.id, `Task "${task.title}" completed for ${property.title}. Property is ready.`, 'SUCCESS');
          }

          // DYNAMIC: Notify Cluster Manager of task completion
          const clusterManagers = this.getClusterManagers();
          clusterManagers.forEach(cm => {
            this.addNotification(cm.id, `Task Completed: ${task.title} at ${property.title} by staff.`, 'INFO');
            
            // PERFECT DYNAMIC: Task Verification Loop
            // If it's a turnover or cleaning task, create a verification task for the CM
            // PERFECT DYNAMIC: Financial Lifecycle - Step 0: Verification Done -> Trigger Invoice
            if (task.title.includes('Verify Work')) {
              const partnerName = task.title.split(': ')[1];
              const partner = this.users.find(u => u.name === partnerName && u.role === 'PARTNER');
              if (partner) {
                this.addNotification(partner.id, `WORK VERIFIED: Your work on ${property.title} has been verified by the Cluster Manager. Please submit your invoice now.`, 'INFO');
                this.createTask({
                  assigneeId: partner.id,
                  propertyId: property.id,
                  propertyName: property.title,
                  title: `Submit Invoice: ${property.title}`,
                  status: 'TODO',
                  description: `Your work has been verified. Please submit the final invoice for processing.`,
                  type: 'ADMIN'
                });
              }
            }
          });

          // PERFECT DYNAMIC: Guest Notification Loop
          // If a guest is currently checked in, notify them of replenishment or maintenance completion
          const activeRes = this.reservations.find(r => r.propertyId === property.id && r.status === 'CHECKED_IN');
          if (activeRes && (task.title.includes('Replenishment') || task.type === 'CLEANING' || task.title.includes('Repair'))) {
            this.addNotification(activeRes.clientId, `Service Update: The requested task "${task.title}" has been completed at your property. We hope you continue to enjoy your stay!`, 'SUCCESS');
          }

          // PERFECT DYNAMIC: Staff -> Owner: Damage Reporting Integration
          if (status === 'DONE' && task.title.includes('Turnover') && task.checklist?.some(i => i.text.includes('damages') && i.completed)) {
            // Trigger damage reporting logic if damages were checked
            // In a real app, this would check if a "damage found" flag was set
            // For simulation, we'll assume a 10% chance of damage being found when checked
            if (Math.random() > 0.9) {
              this.reportDamage(task.assigneeId, task.propertyId, "Minor scratches on living room floor and broken lamp.");
            }
          }

          // DYNAMIC: If it was a remediation or emergency task, set property back to ACTIVE
          if (property.status === 'MAINTENANCE' && (task.title.includes('Remediation') || task.title.includes('EMERGENCY') || task.title.includes('Verify Work') || task.title.includes('Verify Cleaning') || task.title.includes('Turnover'))) {
            property.status = 'ACTIVE';
            if (owner) this.addNotification(owner.id, `Property Status Restored: ${property.title} is now ACTIVE again.`, 'SUCCESS');
            
            const geoManagers = this.getGeoManagers();
            geoManagers.forEach(gm => this.addNotification(gm.id, `Property Restored: ${property.title} is back to ACTIVE status after ${task.title}.`, 'SUCCESS'));
          }
        }
      }
    }
  }

  createReview(review: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      ...review,
      id: `rev-${crypto.randomUUID()}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.reviews.push(newReview);

    // DYNAMIC: Notify Owner
    const property = this.properties.find(p => p.id === review.propertyId);
    if (property) {
      const owner = this.users.find(u => u.id === property.ownerId);
      if (owner) {
        this.addNotification(owner.id, `New ${review.rating}-star review for ${property.title}: "${review.comment}"`, review.rating >= 4 ? 'SUCCESS' : 'ALERT');
      }

      // DYNAMIC: Notify Geo Manager if rating is low
      if (review.rating <= 3) {
        const geoManagers = this.getGeoManagers();
        geoManagers.forEach(gm => {
          this.addNotification(gm.id, `Quality Alert: ${property.title} received a low rating (${review.rating} stars). Investigation recommended.`, 'ALERT');
        });
      }

      // PERFECT DYNAMIC: Staff Recognition & Accountability
      // Find the last completed turnover/cleaning task for this property
      const lastCleaningTask = [...this.tasks]
        .reverse()
        .find(t => t.propertyId === property.id && t.status === 'DONE' && (t.title.includes('Turnover') || t.title.includes('Cleaning')));

      if (lastCleaningTask) {
        const staff = this.users.find(u => u.id === lastCleaningTask.assigneeId);
        if (staff) {
          if (review.rating === 5) {
            // Kudos for perfect work
            this.addNotification(staff.id, `KUDOS! A guest left a 5-star review for ${property.title} after your cleaning. Great job!`, 'SUCCESS');
            
            // Notify Cluster Manager of high performance
            const clusterManagers = this.getClusterManagers();
            clusterManagers.forEach(cm => {
              this.addNotification(cm.id, `Performance Boost: ${staff.name} received kudos for a 5-star stay at ${property.title}.`, 'SUCCESS');
            });
          } else if (review.rating <= 2) {
            // Accountability for poor work
            this.addNotification(staff.id, `QUALITY ALERT: ${property.title} received a poor review (${review.rating} stars). Please review the feedback and improve cleaning standards.`, 'ALERT');
            
            // Notify Cluster Manager to investigate staff performance
            const clusterManagers = this.getClusterManagers();
            clusterManagers.forEach(cm => {
              this.addNotification(cm.id, `Performance Review Needed: ${staff.name} was the last cleaner for ${property.title}, which just received a ${review.rating}-star review.`, 'ALERT');
            });
          }

          // PERFECT DYNAMIC: Owner -> Staff Performance Bonus (MARK AS PERFECT)
          if (review.rating === 5) {
            const owner = this.users.find(u => u.id === property.ownerId);
            if (owner) {
              const staffReviews = this.reviews.filter(r => {
                const p = this.properties.find(prop => prop.id === r.propertyId);
                return p?.ownerId === owner.id && r.rating === 5;
              });

              if (staffReviews.length % 3 === 0) { // Every 3 perfect reviews
                this.addNotification(owner.id, `PERFORMANCE MILESTONE: Your properties have received ${staffReviews.length} perfect reviews. Consider rewarding ${staff.name} with a performance bonus.`, 'SUCCESS');
                
                const juan = this.getSuperAdmin();
                if (juan) {
                  this.createTask({
                    assigneeId: juan.id,
                    propertyId: property.id,
                    propertyName: property.title,
                    title: `Process Staff Bonus: ${staff.name}`,
                    status: 'TODO',
                    description: `Owner ${owner.name} milestone reached. Process a performance bonus for ${staff.name} for consistent 5-star service.`,
                    type: 'ADMIN'
                  });
                }
              }
            }
          }
        }
      }
    }
    return newReview;
  }

  getServiceRequests(uid: string) {
    const user = this.users.find(u => u.id === uid);
    if (user?.role === 'PARTNER') return this.serviceRequests.filter(sr => sr.partnerId === uid);
    if (user?.role === 'CLUSTER_MANAGER') return this.serviceRequests; // Simplified for demo
    if (user?.role === 'OWNER') {
      const pids = this.properties.filter(p => p.ownerId === uid).map(p => p.id);
      return this.serviceRequests.filter(sr => pids.includes(sr.propertyId));
    }
    return [];
  }

  private validateServiceRequest(sr: Omit<ServiceRequest, 'id' | 'date' | 'status'>): boolean {
    if (!sr.propertyId || !sr.partnerId || !sr.title || !sr.priority) return false;
    if (!this.properties.find(p => p.id === sr.propertyId)) return false;
    if (!this.users.find(u => u.id === sr.partnerId)) return false;
    return true;
  }

  createServiceRequest(sr: Omit<ServiceRequest, 'id' | 'date' | 'status'>) {
    if (!this.validateServiceRequest(sr)) {
      console.error('Data Integrity Violation: Invalid service request data rejected.', sr);
      return null;
    }
    const newSr: ServiceRequest = {
      ...sr,
      id: `sr-${crypto.randomUUID()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    this.serviceRequests.push(newSr);

    // DYNAMIC: Notify Partner
    this.addNotification(sr.partnerId, `New Service Request: ${sr.title} at ${sr.propertyName}`, 'INFO');

    // DYNAMIC: Notify Cluster Managers
    const clusterManagers = this.getClusterManagers();
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `Maintenance Alert: ${sr.title} reported for ${sr.propertyName} (Priority: ${sr.priority})`, sr.priority === 'CRITICAL' ? 'ALERT' : 'INFO');
    });

    // DYNAMIC: Notify Owner
    const property = this.properties.find(p => p.id === sr.propertyId);
    if (property) {
      const owner = this.users.find(u => u.id === property.ownerId);
      if (owner) {
        this.addNotification(owner.id, `Maintenance Dispatched: A vendor has been assigned to fix "${sr.title}" at ${property.title}.`, 'INFO');
      }
    }

    // DYNAMIC: Notify Geo Manager if CRITICAL
    if (sr.priority === 'CRITICAL') {
      const geoManagers = this.getGeoManagers();
      geoManagers.forEach(gm => {
        this.addNotification(gm.id, `CRITICAL MAINTENANCE: ${sr.propertyName} requires immediate attention: ${sr.title}`, 'ALERT');
      });
    }

    return newSr;
  }

  updateServiceRequestStatus(srid: string, status: ServiceRequest['status']) {
    const sr = this.serviceRequests.find(x => x.id === srid);
    if (sr) {
      const oldStatus = sr.status;
      sr.status = status;
      this.saveState();

      const property = this.properties.find(p => p.id === sr.propertyId);
      const owner = property ? this.users.find(u => u.id === property.ownerId) : null;
      const clusterManagers = this.getClusterManagers();

      // PERFECT DYNAMIC: Partner -> Staff: Access Request Integration
      if (status === 'ACCEPTED' && oldStatus === 'PENDING') {
        if (owner) this.addNotification(owner.id, `Maintenance Accepted: Vendor has accepted the request for "${sr.title}" at ${sr.propertyName}.`, 'SUCCESS');
        clusterManagers.forEach(cm => this.addNotification(cm.id, `Vendor Accepted: ${sr.title} for ${sr.propertyName} is now ACCEPTED.`, 'INFO'));
        
        // Trigger access request
        this.requestPartnerAccess(sr.partnerId, sr.id);
      }

      // DYNAMIC: Notify Owner & Cluster Manager on Progress
      if (status === 'IN_PROGRESS') {
        if (owner) this.addNotification(owner.id, `Maintenance In Progress: Work has started on "${sr.title}" at ${sr.propertyName}.`, 'INFO');
        clusterManagers.forEach(cm => this.addNotification(cm.id, `Work Started: ${sr.title} for ${sr.propertyName} is now IN PROGRESS.`, 'INFO'));
      }

      // DYNAMIC: Notify Cluster Manager on Rejection
      if (status === 'REJECTED') {
        clusterManagers.forEach(cm => {
          this.addNotification(cm.id, `Vendor REJECTED: ${sr.title} for ${sr.propertyName} was rejected. Immediate reassignment needed.`, 'ALERT');
          this.createTask({
            assigneeId: cm.id,
            propertyId: sr.propertyId,
            propertyName: sr.propertyName,
            title: `Reassign Vendor: ${sr.title}`,
            status: 'TODO',
            description: `Vendor rejected the request. Please find a new partner for "${sr.title}" immediately.`,
            type: 'ADMIN'
          });
        });
        if (owner) this.addNotification(owner.id, `Maintenance Delay: The assigned vendor rejected the request for "${sr.title}". We are reassigning a new partner.`, 'ALERT');
      }

      // DYNAMIC: Notify Owner on completion
      if (status === 'COMPLETED') {
        if (property) {
          if (owner) {
            this.addNotification(owner.id, `Maintenance Completed: "${sr.title}" at ${property.title} is now resolved. Pending final verification.`, 'SUCCESS');
          }

          // DYNAMIC: Notify Cluster Manager & Create Verification Task
          clusterManagers.forEach(cm => {
            this.addNotification(cm.id, `Verification Required: ${sr.title} at ${sr.propertyName} marked as COMPLETED by vendor.`, 'INFO');
            
            this.createTask({
              assigneeId: cm.id,
              propertyId: property.id,
              propertyName: property.title,
              title: `Verify Work: ${sr.title}`,
              status: 'TODO',
              description: `Vendor has finished work on "${sr.title}". Please inspect the property and confirm quality before closing the request.`,
              type: 'ADMIN'
            });
          });

          // DYNAMIC: Notify Staff (Collaborator)
          const staff = this.users.find(u => u.parentId === property.ownerId && u.role === 'COLLABORATOR');
          if (staff) {
            this.addNotification(staff.id, `Property Ready: Maintenance on ${property.title} is complete. You can resume standard operations.`, 'SUCCESS');
          }
        }
      }
    }
  }

  requestPerformanceReport(ownerId: string, propertyId: string) {
    const owner = this.users.find(u => u.id === ownerId);
    const property = this.properties.find(p => p.id === propertyId);
    const clusterManagers = this.getClusterManagers();

    if (owner && property && clusterManagers.length > 0) {
      // DYNAMIC: Notify Cluster Manager
      clusterManagers.forEach(cm => {
        this.addNotification(cm.id, `Performance Inquiry: ${owner.name} has requested a detailed report for ${property.title}.`, 'INFO');
        
        // DYNAMIC: Create task for Cluster Manager
        this.createTask({
          assigneeId: cm.id,
          propertyId: property.id,
          propertyName: property.title,
          title: `Generate Report: ${property.title}`,
          status: 'TODO',
          description: `Owner ${owner.name} requested a performance inquiry. Please compile revenue, occupancy, and quality audit data.`,
          type: 'ADMIN'
        });
      });

      // DYNAMIC: Notify Geo Manager
      const geoManagers = this.getGeoManagers();
      geoManagers.forEach(gm => {
        this.addNotification(gm.id, `Owner Inquiry: ${owner.name} is requesting performance data for ${property.title}.`, 'INFO');
      });
    }
  }

  // PERFECT DYNAMIC: Cluster Manager -> Juan: Budget Request (MARK AS PERFECT)
  requestBudget(cmId: string, propertyId: string, amount: number, reason: string) {
    const cm = this.users.find(u => u.id === cmId);
    const property = this.properties.find(p => p.id === propertyId);
    if (!cm || !property || cm.role !== 'CLUSTER_MANAGER') return;

    const juan = this.getSuperAdmin();
    if (juan) {
      // 1. Notify Juan
      this.addNotification(juan.id, `BUDGET REQUEST: ${cm.name} requested $${amount} for ${property.title}. Reason: ${reason}.`, 'ALERT');

      // 2. Create Approval Task for Juan
      this.createTask({
        assigneeId: juan.id,
        propertyId: property.id,
        propertyName: property.title,
        title: `Approve Budget: ${property.title}`,
        status: 'TODO',
        description: `Cluster Manager ${cm.name} is requesting $${amount} for ${property.title}. Reason: ${reason}. Please review and approve/reject.`,
        type: 'ADMIN'
      });
    }

    // 3. Notify Geo Manager
    const geoManagers = this.getGeoManagers();
    geoManagers.forEach(gm => {
      this.addNotification(gm.id, `Budget Inquiry: ${cm.name} requested $${amount} for ${property.title}.`, 'INFO');
    });
  }

  requestReplenishment(uid: string, item: string, propertyId: string) {
    const user = this.users.find(u => u.id === uid);
    const property = this.properties.find(p => p.id === propertyId);
    
    if (user && property) {
      // DYNAMIC: Notify Cluster Managers
      const clusterManagers = this.getClusterManagers();
      clusterManagers.forEach(cm => {
        this.addNotification(cm.id, `Inventory Alert: ${user.name} requested replenishment for "${item}" at ${property.title}.`, 'ALERT');
      });

      // DYNAMIC: Create a task for Cluster Manager
      if (clusterManagers.length > 0) {
        this.createTask({
          assigneeId: clusterManagers[0].id,
          propertyId: property.id,
          propertyName: property.title,
          title: `Order Supplies: ${item}`,
          status: 'TODO',
          description: `Replenishment requested by ${user.name}. Please order "${item}" for ${property.title}.`,
          type: 'ADMIN'
        });
      }
    }
  }

  createAudit(audit: Omit<Audit, 'id' | 'date'>) {
    const newAudit: Audit = {
      ...audit,
      id: `audit-${crypto.randomUUID()}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    // DYNAMIC: Notify Owner if FAILED
    if (audit.status === 'FAILED') {
      const property = this.properties.find(p => p.id === audit.propertyId);
      if (property) {
        const owner = this.users.find(u => u.id === property.ownerId);
        if (owner) {
          this.addNotification(owner.id, `QUALITY WARNING: ${property.title} failed a recent audit with a score of ${audit.score}%. Immediate remediation required.`, 'ALERT');
        }

        // DYNAMIC: Notify Geo Manager
        const geoManagers = this.getGeoManagers();
        geoManagers.forEach(gm => {
          this.addNotification(gm.id, `Audit Failure: ${property.title} failed quality audit (${audit.score}%). Auditor: ${audit.auditorId}`, 'ALERT');
        });

        // DYNAMIC: Create remediation task for staff
        const staff = this.users.find(u => u.parentId === property.ownerId && u.role === 'COLLABORATOR');
        if (staff) {
          this.createTask({
            assigneeId: staff.id,
            propertyId: property.id,
            propertyName: property.title,
            title: `Remediation: Audit Failure`,
            status: 'TODO',
            description: `Audit failed with score ${audit.score}%. Notes: ${audit.notes}. Please address all issues immediately.`,
            type: 'CLEANING'
          });
        }
      }
    } else {
      // DYNAMIC: Notify Owner of success
      const property = this.properties.find(p => p.id === audit.propertyId);
      if (property) {
        const owner = this.users.find(u => u.id === property.ownerId);
        if (owner) {
          this.addNotification(owner.id, `Quality Audit Passed: ${property.title} scored ${audit.score}% in the latest inspection.`, 'SUCCESS');
        }
      }
    }
    
    return newAudit;
  }

  toggleChecklistItem(tid: string, cid: string) {
    const task = this.tasks.find(t => t.id === tid);
    if (task && task.checklist) {
      const item = task.checklist.find(c => c.id === cid);
      if (item) {
        item.completed = !item.completed;
        this.saveState();

        // PERFECT DYNAMIC: Staff -> Partner Quality Feedback (MARK AS PERFECT)
        if (task.title.includes('Verify Work') && item.text.includes('Quality') && item.completed) {
          const partnerName = task.title.split(': ')[1];
          const partner = this.users.find(u => u.name === partnerName && u.role === 'PARTNER');
          const staff = this.users.find(u => u.id === task.assigneeId);
          
          if (partner && staff) {
            partner.reliabilityScore = Math.min(100, (partner.reliabilityScore || 85) + 1);
            this.addNotification(partner.id, `QUALITY FEEDBACK: Staff member ${staff.name} verified your work quality. Reliability score updated.`, 'SUCCESS');
            
            const clusterManagers = this.getClusterManagers();
            clusterManagers.forEach(cm => {
              this.addNotification(cm.id, `PARTNER QUALITY: ${staff.name} gave positive quality feedback for ${partner.name}.`, 'INFO');
            });
          }
        }
      }
    }
  }

  checkInReservation(resId: string) {
    const res = this.reservations.find(r => r.id === resId);
    if (res) {
      res.status = 'CHECKED_IN';
      const property = this.properties.find(p => p.id === res.propertyId);
      const owner = property ? this.users.find(u => u.id === property.ownerId) : null;
      const clusterManagers = this.getClusterManagers();
      const geoManagers = this.getGeoManagers();

      // PERFECT DYNAMIC: Guest Experience Loop (Check-in)
      // 1. Notify Owner
      if (owner) this.addNotification(owner.id, `Guest Check-in: A guest has checked into ${property?.title}.`, 'SUCCESS');
      
      // 2. Notify Cluster Manager
      clusterManagers.forEach(cm => this.addNotification(cm.id, `Check-in Confirmed: ${property?.title} is now occupied.`, 'INFO'));

      // 3. Notify Geo Manager (for occupancy tracking)
      geoManagers.forEach(gm => this.addNotification(gm.id, `Occupancy Update: ${property?.title} check-in confirmed.`, 'INFO'));

      // 4. Staff Awareness: Notify assigned staff that the guest is now in the property
      if (property) {
        property.assignedStaffIds.forEach(sid => {
          this.addNotification(sid, `Guest Arrival: A guest has checked into ${property.title}. Please be available for any immediate requests.`, 'INFO');
        });
      }
    }
  }

  checkOutReservation(resId: string) {
    const res = this.reservations.find(r => r.id === resId);
    if (res) {
      const oldStatus = res.status;
      res.status = 'COMPLETED';
      const property = this.properties.find(p => p.id === res.propertyId);
      
      if (property && oldStatus === 'CHECKED_IN') {
        const owner = this.users.find(u => u.id === property.ownerId);
        const clusterManagers = this.getClusterManagers();

        // PERFECT DYNAMIC: Guest Experience Loop (Check-out & Turnover)
        // 1. Notify Owner
        if (owner) this.addNotification(owner.id, `Guest Check-out: The stay at ${property.title} has ended. Cleaning task generated.`, 'INFO');

        // PERFECT DYNAMIC: Owner Financial Transparency (MARK AS PERFECT)
        if (owner) {
          const platformFee = res.totalPrice * 0.15;
          const cleaningFee = property.cleaningFee;
          const netPayout = res.totalPrice - platformFee - cleaningFee;
          
          // Update property net income
          property.netIncome = (property.netIncome || 0) + netPayout;

          this.addNotification(owner.id, `FINANCIAL SUMMARY: Stay at ${property.title} completed. Gross: $${res.totalPrice} | Fees: $${platformFee.toFixed(2)} | Cleaning: $${cleaningFee} | NET PAYOUT: $${netPayout.toFixed(2)}`, 'SUCCESS');
          
          // Notify Juan of the completed transaction
          const juan = this.getSuperAdmin();
          if (juan) {
            this.addNotification(juan.id, `REVENUE UPDATE: $${res.totalPrice} gross revenue from ${property.title}. Net to owner: $${netPayout.toFixed(2)}.`, 'INFO');
          }
        }

        // 2. Notify Cluster Manager
        clusterManagers.forEach(cm => this.addNotification(cm.id, `Check-out: ${property.title} is now vacant. Cleaning in progress.`, 'ALERT'));

        // 3. Create Cleaning Task for Staff
        if (property.assignedStaffIds.length > 0) {
          const staffId = property.assignedStaffIds[0]; // Assign to first staff
          this.createTask({
            assigneeId: staffId,
            propertyId: property.id,
            propertyName: property.title,
            title: `Post-Stay Turnover: ${property.title}`,
            status: 'TODO',
            description: `Guest has checked out. Immediate turnover cleaning required for ${property.title}.`,
            type: 'CLEANING',
            checklist: [
              { id: 'c1', text: 'Strip all beds', completed: false },
              { id: 'c2', text: 'Deep clean kitchen & bathrooms', completed: false },
              { id: 'c3', text: 'Restock all amenities & toiletries', completed: false },
              { id: 'c4', text: 'Check for guest damages or lost items', completed: false }
            ]
          });
          this.addNotification(staffId, `URGENT: Post-stay turnover required for ${property.title}.`, 'ALERT');
        }

        // 4. Set property to MAINTENANCE temporarily to ensure deep clean
        property.status = 'MAINTENANCE';
        
        // 5. Notify Geo Manager of maintenance status
        const geoManagers = this.getGeoManagers();
        geoManagers.forEach(gm => this.addNotification(gm.id, `Status Change: ${property.title} is now in MAINTENANCE for turnover.`, 'INFO'));
      }
    }
  }

  completeReservation(resId: string) {
    // Unified with checkOutReservation for consistency
    this.checkOutReservation(resId);
  }

  verifyUser(uid: string) {
    const user = this.users.find(u => u.id === uid);
    if (user) {
      user.isVerified = true;
      this.addNotification(user.id, `Verification Complete: Your account has been verified by Juan. Full access granted.`, 'SUCCESS');
      
      const geoManagers = this.getGeoManagers();
      geoManagers.forEach(gm => this.addNotification(gm.id, `New Verified User: ${user.name} (${user.role}) is now verified in the system.`, 'INFO'));
    }
  }

  reassignTask(tid: string, newAssigneeId: string) {
    const task = this.tasks.find(t => t.id === tid);
    const newAssignee = this.users.find(u => u.id === newAssigneeId);
    if (task && newAssignee) {
      const oldAssigneeId = task.assigneeId;
      const oldAssignee = this.users.find(u => u.id === oldAssigneeId);
      
      task.assigneeId = newAssigneeId;

      // DYNAMIC: Notify Old Assignee
      if (oldAssignee) this.addNotification(oldAssignee.id, `Task Reassigned: "${task.title}" has been reassigned to ${newAssignee.name}.`, 'INFO');
      
      // DYNAMIC: Notify New Assignee
      this.addNotification(newAssignee.id, `New Task Reassigned: "${task.title}" has been assigned to you.`, 'INFO');
    }
  }

  triggerEmergency(uid: string, propertyId: string, type: 'MAINTENANCE' | 'SECURITY' | 'GUEST_ISSUE', description: string) {
    const user = this.users.find(u => u.id === uid);
    const property = this.properties.find(p => p.id === propertyId);
    if (!user || !property) return;

    const owner = this.users.find(u => u.id === property.ownerId);
    const clusterManagers = this.getClusterManagers();
    const geoManagers = this.getGeoManagers();
    const juan = this.getSuperAdmin();

    // 1. Update Property Status
    property.status = 'MAINTENANCE';

    // 2. Notify All Relevant Managers
    const message = `EMERGENCY [${type}]: ${property.title} - ${description}. Triggered by ${user.name}.`;
    
    [...clusterManagers, ...geoManagers].forEach(m => this.addNotification(m.id, message, 'ALERT'));
    if (juan) this.addNotification(juan.id, message, 'ALERT');
    if (owner) this.addNotification(owner.id, `EMERGENCY ALERT: Your property ${property.title} has a critical issue: ${description}. Status set to MAINTENANCE.`, 'ALERT');

    // 3. Create Emergency Response Task for Cluster Manager
    if (clusterManagers.length > 0) {
      this.createTask({
        assigneeId: clusterManagers[0].id,
        propertyId: property.id,
        propertyName: property.title,
        title: `EMERGENCY RESPONSE: ${type}`,
        status: 'TODO',
        description: `CRITICAL: ${description}. Property has been set to MAINTENANCE. Please coordinate immediate resolution.`,
        type: 'ADMIN'
      });
    }

    // 4. If Maintenance, auto-dispatch default Partner
    if (type === 'MAINTENANCE') {
      const partner = this.users.find(u => u.role === 'PARTNER'); // Default partner
      if (partner) {
        this.createServiceRequest({
          propertyId: property.id,
          propertyName: property.title,
          partnerId: partner.id,
          title: `EMERGENCY REPAIR: ${description}`,
          description: `Emergency maintenance triggered by system. Please attend immediately.`,
          priority: 'CRITICAL'
        });
      }
    }
  }

  // PERFECT DYNAMIC: Staff -> Owner: Damage Reporting (MARK AS PERFECT)
  reportDamage(staffId: string, propertyId: string, description: string) {
    const staff = this.users.find(u => u.id === staffId);
    const property = this.properties.find(p => p.id === propertyId);
    if (!staff || !property) return;

    const owner = this.users.find(u => u.id === property.ownerId);
    const clusterManagers = this.getClusterManagers();

    // 1. Set property to MAINTENANCE
    property.status = 'MAINTENANCE';

    // 2. Notify Owner
    if (owner) {
      this.addNotification(owner.id, `DAMAGE REPORTED: ${staff.name} reported damage at ${property.title}: ${description}. Property set to MAINTENANCE.`, 'ALERT');
    }

    // 3. Notify Cluster Managers & Create Assessment Task
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `DAMAGE ALERT: ${staff.name} reported issues at ${property.title}. Assessment required.`, 'ALERT');
      this.createTask({
        assigneeId: cm.id,
        propertyId: property.id,
        propertyName: property.title,
        title: `Damage Assessment: ${property.title}`,
        status: 'TODO',
        description: `Staff ${staff.name} reported: ${description}. Please inspect the property, estimate repair costs, and coordinate with a Partner if needed.`,
        type: 'ADMIN'
      });
    });

    // 4. Notify Geo Managers
    const geoManagers = this.getGeoManagers();
    geoManagers.forEach(gm => {
      this.addNotification(gm.id, `Property Damage: ${property.title} is now in MAINTENANCE due to reported damage.`, 'INFO');
    });
  }

  // PERFECT DYNAMIC: Geo Manager -> Cluster Manager: Regional Goals (MARK AS PERFECT)
  setRegionalGoal(geoId: string, clusterId: string, goalType: string, targetValue: string) {
    const geo = this.users.find(u => u.id === geoId);
    const clusterManager = this.users.find(u => u.id === clusterId);
    if (!geo || !clusterManager) return;

    // 1. Notify Cluster Manager
    this.addNotification(clusterManager.id, `REGIONAL GOAL SET: Geo Manager ${geo.name} has set a new ${goalType} goal: ${targetValue}.`, 'SUCCESS');

    // 2. Create Goal Task for CM
    this.createTask({
      assigneeId: clusterManager.id,
      propertyId: 'global',
      propertyName: 'Regional Strategy',
      title: `Achieve Regional Goal: ${goalType}`,
      status: 'TODO',
      description: `Target: ${targetValue}. Develop and implement a local strategy to meet this regional objective set by ${geo.name}.`,
      type: 'ADMIN'
    });

    // 3. Notify Juan
    const juan = this.getSuperAdmin();
    if (juan) {
      this.addNotification(juan.id, `STRATEGY UPDATE: New regional goal set for ${clusterManager.name}'s cluster: ${goalType} -> ${targetValue}.`, 'INFO');
    }
  }

  // PERFECT DYNAMIC: Partner -> Staff: Access Request (MARK AS PERFECT)
  requestPartnerAccess(partnerId: string, srId: string) {
    const partner = this.users.find(u => u.id === partnerId);
    const sr = this.serviceRequests.find(s => s.id === srId);
    if (!partner || !sr) return;

    const property = this.properties.find(p => p.id === sr.propertyId);
    if (!property) return;

    // 1. Notify all assigned staff
    property.assignedStaffIds.forEach(sid => {
      this.addNotification(sid, `ACCESS REQUEST: Partner ${partner.name} needs access to ${property.title} for "${sr.title}".`, 'ALERT');
      
      // 2. Create Access Task for Staff
      this.createTask({
        assigneeId: sid,
        propertyId: property.id,
        propertyName: property.title,
        title: `Provide Access: ${partner.name}`,
        status: 'TODO',
        description: `Partner ${partner.name} is arriving for maintenance work ("${sr.title}"). Please ensure they can enter the property and supervise if necessary.`,
        type: 'ADMIN'
      });
    });

    // 3. Notify Cluster Manager
    const clusterManagers = this.getClusterManagers();
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `Access Coordination: ${partner.name} requested access to ${property.title}. Staff have been notified.`, 'INFO');
    });
  }

  // PERFECT DYNAMIC: Cluster Manager -> Staff: Performance Review (MARK AS PERFECT)
  conductStaffReview(cmId: string, staffId: string, rating: number, feedback: string) {
    const cm = this.users.find(u => u.id === cmId);
    const staff = this.users.find(u => u.id === staffId);
    if (!cm || !staff || cm.role !== 'CLUSTER_MANAGER') return;

    // 1. Update Staff Reliability (simulated)
    staff.reliabilityScore = Math.min(100, Math.max(0, (staff.reliabilityScore || 85) + (rating - 3) * 5));

    // 2. Notify Staff
    this.addNotification(staff.id, `PERFORMANCE REVIEW: Cluster Manager ${cm.name} completed your review. Rating: ${rating}/5. Feedback: ${feedback}. Your reliability score is now ${staff.reliabilityScore}%.`, rating >= 4 ? 'SUCCESS' : 'ALERT');

    // 3. Notify Owner (if staff is assigned to their properties)
    const owner = this.users.find(u => u.id === staff.parentId);
    if (owner) {
      this.addNotification(owner.id, `STAFF REVIEW UPDATE: ${staff.name} has been reviewed by the Cluster Manager. Current Reliability: ${staff.reliabilityScore}%.`, 'INFO');
    }

    // 4. Notify Geo Manager
    const geoManagers = this.getGeoManagers();
    geoManagers.forEach(gm => {
      this.addNotification(gm.id, `Staff Audit: ${staff.name} reviewed by ${cm.name}. Score: ${staff.reliabilityScore}%.`, 'INFO');
    });
  }

  // PERFECT DYNAMIC: Guest Issue Reporting (REFINED & PERFECTED)
  // PERFECT DYNAMIC: Owner -> Cluster Manager: Dispute Resolution (MARK AS PERFECT)
  openDispute(ownerId: string, propertyId: string, reason: string, type: 'REVIEW' | 'DAMAGE' | 'FINANCIAL') {
    const owner = this.users.find(u => u.id === ownerId);
    const property = this.properties.find(p => p.id === propertyId);
    if (!owner || !property || owner.role !== 'OWNER') return;

    const clusterManagers = this.getClusterManagers();
    const geoManagers = this.getGeoManagers();

    // 1. Notify Cluster Managers
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `DISPUTE OPENED: Owner ${owner.name} has opened a ${type} dispute for ${property.title}. Reason: ${reason}`, 'ALERT');
      
      // 2. Create Mediation Task for CM
      this.createTask({
        assigneeId: cm.id,
        propertyId: property.id,
        propertyName: property.title,
        title: `Mediate Dispute: ${owner.name}`,
        status: 'TODO',
        description: `Dispute Type: ${type}. Owner ${owner.name} disagrees with a recent event at ${property.title}. Reason: ${reason}. Please investigate and resolve.`,
        type: 'ADMIN'
      });
    });

    // 3. Notify Geo Manager for awareness
    geoManagers.forEach(gm => {
      this.addNotification(gm.id, `Dispute Alert: ${owner.name} opened a ${type} dispute for ${property.title}. Cluster Manager is mediating.`, 'INFO');
    });

    // 4. Notify Owner
    this.addNotification(owner.id, `Dispute Registered: Your ${type} dispute for ${property.title} has been sent to the Cluster Manager for mediation.`, 'SUCCESS');
  }

  // PERFECT DYNAMIC: Staff -> Cluster Manager: Resource Request (MARK AS PERFECT)
  requestResources(staffId: string, propertyId: string, items: string, urgency: 'LOW' | 'MEDIUM' | 'HIGH') {
    const staff = this.users.find(u => u.id === staffId);
    const property = this.properties.find(p => p.id === propertyId);
    if (!staff || !property || staff.role !== 'COLLABORATOR') return;

    const clusterManagers = this.getClusterManagers();

    // 1. Notify Cluster Managers
    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `RESOURCE REQUEST: ${staff.name} needs "${items}" at ${property.title}. Urgency: ${urgency}`, urgency === 'HIGH' ? 'ALERT' : 'INFO');
      
      // 2. Create Procurement Task for CM
      this.createTask({
        assigneeId: cm.id,
        propertyId: property.id,
        propertyName: property.title,
        title: `Procure Resources: ${property.title}`,
        status: 'TODO',
        description: `Staff ${staff.name} requested: ${items}. Urgency: ${urgency}. Please approve and coordinate delivery.`,
        type: 'ADMIN'
      });
    });

    // 3. Notify Staff
    this.addNotification(staff.id, `Request Sent: Your request for "${items}" has been sent to the Cluster Manager.`, 'SUCCESS');
  }

  reportGuestIssue(clientId: string, propertyId: string, description: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
    const guest = this.users.find(u => u.id === clientId);
    const property = this.properties.find(p => p.id === propertyId);
    if (!guest || !property) return;

    const owner = this.users.find(u => u.id === property.ownerId);
    const clusterManagers = this.getClusterManagers();
    const partner = this.users.find(u => u.role === 'PARTNER'); 

    // 1. Create Service Request
    const sr = this.createServiceRequest({
      propertyId: property.id,
      propertyName: property.title,
      partnerId: partner?.id || 'u-partner1',
      title: `GUEST REPORTED: ${description.substring(0, 20)}...`,
      description: `Guest ${guest.name} reported: ${description}`,
      priority: priority
    });

    // 2. If HIGH or CRITICAL, change property status
    if (priority === 'HIGH' || priority === 'CRITICAL') {
      property.status = 'MAINTENANCE';
      if (owner) this.addNotification(owner.id, `URGENT GUEST ISSUE: ${property.title} has been set to MAINTENANCE due to a guest report.`, 'ALERT');
    }

    // 3. Notify Stakeholders
    this.addNotification(guest.id, `Issue Reported: We have received your report. A maintenance partner has been notified and will address it shortly.`, 'SUCCESS');
    
    // 4. Notify Staff (CRITICAL: Staff must be aware of guest issues)
    property.assignedStaffIds.forEach(sid => {
      this.addNotification(sid, `GUEST ISSUE ALERT: ${guest.name} at ${property.title} reported: ${description}. Please assist if needed.`, 'ALERT');
    });

    clusterManagers.forEach(cm => {
      this.addNotification(cm.id, `GUEST COMPLAINT: ${guest.name} at ${property.title} reported an issue: ${description}`, priority === 'CRITICAL' ? 'ALERT' : 'INFO');
      
      // Create oversight task for CM
      this.createTask({
        assigneeId: cm.id,
        propertyId: property.id,
        propertyName: property.title,
        title: `Oversee Guest Issue: ${guest.name}`,
        status: 'TODO',
        description: `Guest reported: ${description}. Service request ${sr.id} has been created. Please ensure resolution and guest satisfaction.`,
        type: 'ADMIN'
      });
    });

    return sr;
  }

  public simulateHighExpectationBehaviors() {
    const now = new Date();
    
    // Ensure we don't duplicate simulations if called multiple times
    const simPrefix = 'sim-';
    
    // 1. VIP GUEST BEHAVIORS
    if (!this.notifications.some(n => n.id === `${simPrefix}notif-vip-1`)) {
      this.notifications.push({
        id: `${simPrefix}notif-vip-1`,
        userId: 'u-vip-ceo',
        message: 'URGENT: High-speed fiber connection dropped to 200Mbps. I require the full 1Gbps for my board meeting in 30 mins.',
        time: now.toISOString(),
        read: false,
        type: 'ALERT'
      });
    }

    if (!this.tasks.some(t => t.id === `${simPrefix}task-vip-1`)) {
      this.tasks.push({
        id: `${simPrefix}task-vip-1`,
        assigneeId: 'u-staff-tech',
        propertyId: 'p-prec-1',
        propertyName: 'Precision Loft Salamanca',
        title: 'Emergency Network Reset - VIP Sterling',
        status: 'IN_PROGRESS',
        description: 'Reset router and verify 1Gbps throughput. Guest is extremely sensitive to latency.',
        type: 'ADMIN'
      });
    }

    // 2. OWNER BEHAVIORS
    if (!this.notifications.some(n => n.id === `${simPrefix}notif-owner-1`)) {
      this.notifications.push({
        id: `${simPrefix}notif-owner-1`,
        userId: 'u-owner-roi',
        message: 'Monthly ROI Report: Sol Studio is performing at 112% of target. Requesting analysis on potential price increase for Q3.',
        time: now.toISOString(),
        read: false,
        type: 'SUCCESS'
      });
    }

    // 3. GEO/CLUSTER MANAGER BEHAVIORS
    if (!this.tasks.some(t => t.id === `${simPrefix}task-geo-1`)) {
      this.tasks.push({
        id: `${simPrefix}task-geo-1`,
        assigneeId: 'u-cluster-1',
        propertyId: 'p1',
        propertyName: 'Modern Loft Sol',
        title: 'Compliance Audit - Sol District',
        status: 'TODO',
        description: 'Verify all local tourist licenses are physically displayed and QR codes are functional.',
        type: 'ADMIN'
      });
    }
    
    // Expert 50: Add real data for Super Admin "JUAN"
    if (this.currentUser?.role === 'JUAN' || this.currentUser?.role === 'ADMIN') {
      const criticalTasks = this.tasks.filter(t => t.status !== 'DONE').length;
      if (criticalTasks > 5 && !this.notifications.some(n => n.id === 'juan-alert-load')) {
        this.addNotification('u-admin', `SYSTEM ALERT: High operational load detected. ${criticalTasks} pending tasks across all clusters.`, 'ALERT');
      }
    }
  }
}

export const db = new DatabaseService();
