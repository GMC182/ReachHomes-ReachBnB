
import React, { useState, useEffect } from 'react';
import { db } from '../services/DatabaseService';
import { Property, Review } from '../types';
import { 
  ArrowLeft, Star, MapPin, ShieldCheck, Calendar, 
  Users, CheckCircle, Heart, Share2, Info, X, Plus, Minus, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Modal: React.FC<{ title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ title, isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0a0a0a] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-light tracking-widest text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-white/80">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DatePickerModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (start: Date | null, end: Date | null) => void; initialStart: Date | null; initialEnd: Date | null; propertyId: string }> = ({ isOpen, onClose, onSelect, initialStart, initialEnd, propertyId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(initialStart);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd);

  const reservations = db.getPropertyReservations(propertyId);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const isBooked = (date: Date) => {
    return reservations.some(r => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      return date >= start && date <= end;
    });
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today || isBooked(selectedDate)) return; // Cannot select past or booked dates

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (selectedDate < startDate) {
      setStartDate(selectedDate);
    } else {
      // Check if there are any booked dates between startDate and selectedDate
      let hasBookedDatesInRange = false;
      let curr = new Date(startDate);
      while (curr <= selectedDate) {
        if (isBooked(curr)) {
          hasBookedDatesInRange = true;
          break;
        }
        curr.setDate(curr.getDate() + 1);
      }

      if (hasBookedDatesInRange) {
        setStartDate(selectedDate);
        setEndDate(null);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const handleApply = () => {
    onSelect(startDate, endDate);
    onClose();
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const isSelected = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (startDate && d.getTime() === startDate.getTime()) return true;
    if (endDate && d.getTime() === endDate.getTime()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d > startDate && d < endDate;
  };

  const isPast = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  return (
    <Modal title="Select Dates" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <h4 className="text-xl font-light tracking-widest text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h4>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={20} /></button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 w-full text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 w-full">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const selected = isSelected(day);
            const inRange = isInRange(day);
            const past = isPast(day);
            const booked = isBooked(d);
            
            return (
              <button 
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={past || booked}
                className={`h-12 w-full rounded-full flex items-center justify-center text-sm transition-all duration-300 relative
                  ${past || booked ? 'text-white/20 cursor-not-allowed' : 'hover:bg-white/10'}
                  ${selected ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]' : ''}
                  ${inRange ? 'bg-amber-500/20 text-amber-400' : ''}
                  ${!selected && !inRange && !past && !booked ? 'text-white' : ''}
                `}
              >
                {day}
                {booked && !past && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500/50"></div>}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end w-full gap-4">
          <button onClick={() => { setStartDate(null); setEndDate(null); }} className="px-6 py-3 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Clear</button>
          <button onClick={handleApply} className="px-8 py-3 bg-amber-500 text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]">Apply Dates</button>
        </div>
      </div>
    </Modal>
  );
};

export const PublicListingView: React.FC<{ propertyId: string, onBack: () => void }> = ({ propertyId, onBack }) => {
  const listing = db.getListingData(propertyId);
  const [showReviews, setShowReviews] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nights, setNights] = useState(5);
  const [isReserving, setIsReserving] = useState(false);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  if (!listing.property) return null;
  const p = listing.property;
  const subtotal = p.pricePerNight * nights;
  const total = subtotal + p.cleaningFee + p.serviceFee;

  const handleReserve = () => {
    setIsReserving(true);
    setTimeout(() => {
      const user = db.getCurrentUser();
      if (user && startDate && endDate) {
        db.createReservation({
          propertyId: p.id,
          clientId: user.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guests: guests,
          totalPrice: total
        });
      }
      setIsReserving(false);
      setReserved(true);
    }, 500);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Add date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#0a0a0a] pb-20 font-sans text-white"
    >
      <nav className="sticky top-0 bg-black/80 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex justify-between items-center z-50 transition-all">
        <button onClick={onBack} className="flex items-center gap-3 font-bold text-white/50 hover:text-amber-500 transition-colors uppercase tracking-widest text-xs"><ArrowLeft size={16}/> Back to Collection</button>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-white/10 text-white/70 hover:text-amber-500 rounded-full transition-colors border border-transparent hover:border-white/10"><Share2 size={18}/></button>
            <button className="p-2.5 hover:bg-white/10 text-white/70 hover:text-amber-500 rounded-full transition-colors border border-transparent hover:border-white/10"><Heart size={18}/></button>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          {db.getCurrentUser() ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 font-bold text-xs">
                {db.getCurrentUser()?.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-white/70 uppercase tracking-widest hidden sm:block">{db.getCurrentUser()?.name}</span>
            </div>
          ) : (
            <button onClick={onBack} className="text-xs font-bold text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors">Log In</button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-12 px-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-light mb-6 tracking-wide text-white" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {p.title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-between items-center mb-10"
        >
          <div className="flex items-center gap-6 text-sm font-medium text-white/70">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"><Star size={14} className="fill-amber-500 text-amber-500"/> <span className="text-white font-bold">{p.rating}</span></div>
            <button onClick={() => setShowReviews(true)} className="underline decoration-white/30 hover:decoration-amber-500 hover:text-amber-500 transition-colors">{listing.reviews.length} reviews</button>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-amber-500"/> Costa del Sol, Spain</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[500px] mb-16 rounded-[2rem] overflow-hidden cursor-pointer group shadow-2xl shadow-amber-500/5 border border-white/10" 
          onClick={() => setShowGallery(true)}
        >
          <div className="md:col-span-2 h-full w-full overflow-hidden relative">
            <img src={p.images[0]} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 md:col-span-2 gap-4">
            <div className="overflow-hidden relative"><img src={p.images[1]} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out delay-75" /><div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div></div>
            <div className="overflow-hidden relative"><img src={p.images[2]} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out delay-150" /><div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div></div>
            <div className="bg-white/5 backdrop-blur-md flex items-center justify-center text-white font-light tracking-widest uppercase text-sm hover:bg-amber-500 hover:text-black transition-all duration-500 border border-white/10">View Gallery</div>
          </div>
          <div className="md:hidden absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/10">
            View Gallery
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-8 order-2 lg:order-1"
          >
            <h2 className="text-3xl font-light mb-4 text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Exclusive Villa hosted by Owner</h2>
            <p className="text-amber-500/70 mb-10 font-bold uppercase tracking-widest text-xs">{p.maxGuests} guests • {p.bedrooms} bedrooms • {p.baths} baths</p>
            
            <div className="border-t border-white/10 py-10 space-y-8">
              <div className="flex gap-6 items-start bg-white/5 p-6 rounded-2xl border border-white/5">
                <ShieldCheck className="text-amber-500 mt-1 shrink-0" size={28}/>
                <div>
                  <p className="font-bold text-white text-lg mb-2">ReachHomes Prestige Protection</p>
                  <p className="text-sm text-white/60 leading-relaxed">Every reservation includes complimentary elite protection against host cancellations, listing inaccuracies, and any inconveniences during your stay.</p>
                </div>
              </div>
              <p className="text-white/70 leading-loose pt-4 text-lg font-light">{p.description}</p>
            </div>
            
            <div className="border-t border-white/10 py-10">
              <h3 className="text-2xl font-light mb-8 text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Premium Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                {p.amenities.map((amenity, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (i * 0.05) }}
                    key={amenity} 
                    className="flex items-center gap-4 text-white/80"
                  >
                    <CheckCircle size={20} className="text-amber-500"/> <span className="font-medium">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-4 order-1 lg:order-2"
          >
            <div className="sticky top-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
              <div className="flex justify-between items-end mb-8">
                <div><span className="text-4xl font-light text-white tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>${p.pricePerNight}</span> <span className="text-amber-500/70 font-bold uppercase tracking-widest text-[10px] ml-2">/ night</span></div>
                <div className="flex items-center gap-2 font-bold text-sm text-white bg-white/10 px-3 py-1.5 rounded-full"><Star size={14} className="fill-amber-500 text-amber-500"/> {p.rating}</div>
              </div>
              
              <div className="border border-white/20 rounded-2xl divide-y divide-white/20 mb-8 overflow-hidden bg-black/50">
                <div className="grid grid-cols-2 divide-x divide-white/20">
                  <button onClick={() => setShowDatePicker(true)} className="p-4 hover:bg-white/5 text-left transition-colors">
                    <div className="text-[10px] font-black text-amber-500/70 uppercase tracking-widest mb-1">Check-in</div>
                    <div className="text-sm text-white font-medium">{formatDate(startDate)}</div>
                  </button>
                  <button onClick={() => setShowDatePicker(true)} className="p-4 hover:bg-white/5 text-left transition-colors">
                    <div className="text-[10px] font-black text-amber-500/70 uppercase tracking-widest mb-1">Check-out</div>
                    <div className="text-sm text-white font-medium">{formatDate(endDate)}</div>
                  </button>
                </div>
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-white/5 transition-colors gap-4 sm:gap-0">
                  <div>
                    <div className="text-[10px] font-black text-amber-500/70 uppercase tracking-widest mb-1">Guests</div>
                    <div className="text-sm text-white font-medium">{guests} guests</div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-2 border border-white/20 rounded-full hover:border-amber-500 hover:text-amber-500 transition-all text-white/70"><Minus size={14}/></button>
                    <button onClick={() => setGuests(Math.min(p.maxGuests, guests + 1))} className="p-2 border border-white/20 rounded-full hover:border-amber-500 hover:text-amber-500 transition-all text-white/70"><Plus size={14}/></button>
                  </div>
                </div>
              </div>

              {reserved ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-2xl font-bold text-lg mb-6 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle size={24} /> Reservation Confirmed
                </motion.div>
              ) : (
                <button 
                  onClick={handleReserve} 
                  disabled={isReserving || !startDate || !endDate}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-black rounded-2xl font-black uppercase tracking-widest text-sm mb-6 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isReserving ? <Loader2 size={20} className="animate-spin" /> : 'Request to Book'}
                </button>
              )}
              
              {!reserved && <p className="text-center text-white/40 text-xs mb-8 font-medium uppercase tracking-widest">You won't be charged yet</p>}

              <div className="space-y-5 text-white/70 text-sm font-medium">
                <div className="flex justify-between"><span>${p.pricePerNight} x {nights} nights</span><span className="text-white">${subtotal}</span></div>
                <div className="flex justify-between"><span>Cleaning fee</span><span className="text-white">${p.cleaningFee}</span></div>
                <div className="flex justify-between"><span>Service fee</span><span className="text-white">${p.serviceFee}</span></div>
                <div className="flex justify-between pt-6 border-t border-white/10 font-light tracking-widest text-white text-xl" style={{ fontFamily: "'Playfair Display', serif" }}><span>Total</span><span>${total}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal title="Guest Reviews" isOpen={showReviews} onClose={() => setShowReviews(false)}>
        <div className="space-y-8">
          {listing.reviews.map((r, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={r.id} 
              className="border-b border-white/10 pb-8 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-black rounded-full flex items-center justify-center font-black text-lg shadow-lg">{r.clientName.charAt(0)}</div>
                <div>
                  <div className="font-bold text-white text-lg">{r.clientName}</div>
                  <div className="text-xs text-amber-500/70 uppercase tracking-widest font-bold mt-1">{r.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? "fill-amber-500 text-amber-500" : "fill-white/10 text-white/10"} />
                ))}
              </div>
              <p className="text-white/70 leading-relaxed text-lg font-light">{r.comment}</p>
            </motion.div>
          ))}
        </div>
      </Modal>

      <Modal title="Photo Gallery" isOpen={showGallery} onClose={() => setShowGallery(false)}>
        <div className="grid gap-8">
          {p.images.map((img, i) => (
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              src={img} 
              referrerPolicy="no-referrer"
              className="rounded-[2rem] w-full object-cover shadow-2xl border border-white/10" 
              alt={`Property view ${i + 1}`} 
            />
          ))}
        </div>
      </Modal>

      <DatePickerModal 
        isOpen={showDatePicker} 
        onClose={() => setShowDatePicker(false)} 
        onSelect={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        initialStart={startDate}
        initialEnd={endDate}
        propertyId={propertyId}
      />
    </motion.div>
  );
};
