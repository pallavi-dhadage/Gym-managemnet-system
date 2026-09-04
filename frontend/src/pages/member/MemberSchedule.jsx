import { Calendar, Clock, Dumbbell, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DAY_COLORS = { Monday:'#00D4FF', Tuesday:'#39FF14', Wednesday:'#FF6B00', Thursday:'#A855F7', Friday:'#F59E0B', Saturday:'#EC4899', Sunday:'#6B7280' };

export default function MemberSchedule() {
  const { currentUser } = useAuth();
  const schedule = currentUser?.memberProfile?.workoutSchedule || [];
  const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">My Workout Schedule</h1>
        <p className="text-gray-500 text-sm">Your personalised weekly training plan</p>
      </div>

      {/* Today highlight */}
      {schedule.find(d => d.day === today) && (
        <div className="bg-gray-900 border-2 rounded-2xl p-5 overflow-hidden relative" style={{ borderColor: `${DAY_COLORS[today]}40` }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: DAY_COLORS[today] }} />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: DAY_COLORS[today] }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: DAY_COLORS[today] }}>Today — {today}</span>
          </div>
          {(() => {
            const d = schedule.find(s => s.day === today);
            return d.workout === 'Rest Day' ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl">😴</span>
                <div>
                  <p className="font-black text-white text-xl">Rest Day</p>
                  <p className="text-gray-400 text-sm">Recovery is crucial. Rest up!</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${DAY_COLORS[today]}20` }}>
                  <Dumbbell size={24} style={{ color: DAY_COLORS[today] }} />
                </div>
                <div>
                  <p className="font-black text-white text-xl">{d.workout}</p>
                  <p className="text-gray-400 text-sm">{d.time} · {d.duration}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Full week */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Full Weekly Plan</h3>
        {schedule.map((day, i) => {
          const isToday = day.day === today;
          const isRest = day.workout === 'Rest Day';
          const color = DAY_COLORS[day.day] || '#6B7280';
          return (
            <div key={i} className={`bg-gray-900 border rounded-2xl p-4 flex items-center gap-4 transition-all ${isToday ? 'border-2' : 'border-gray-800'}`}
              style={isToday ? { borderColor: `${color}40` } : {}}>
              {/* Day badge */}
              <div className="w-16 text-center flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ background: isRest ? '#1f2937' : `${color}18` }}>
                  {isRest ? <span className="text-base">😴</span> : <Dumbbell size={16} style={{ color }} />}
                </div>
                <p className="text-xs font-bold" style={{ color: isToday ? color : '#6B7280' }}>{day.day.slice(0,3)}</p>
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${isRest ? 'text-gray-500' : 'text-white'}`}>{day.workout}</p>
                {!isRest && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Clock size={10} />{day.time} · {day.duration}</p>}
              </div>

              {isToday && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0" style={{ background: `${color}15`, color }}>
                  <Check size={10} /> Today
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <p className="text-xs text-gray-500">Schedule is set by your assigned trainer <span className="text-white font-semibold">{currentUser?.memberProfile?.trainer}</span>. Contact them to adjust your plan.</p>
      </div>
    </div>
  );
}
