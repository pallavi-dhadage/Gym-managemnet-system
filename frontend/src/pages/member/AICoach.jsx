import { useState } from 'react';
import { Bot, Zap, Target, TrendingUp, Activity, Apple, Dumbbell, Calendar, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AICoach() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('suggestions');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: `Hi ${currentUser?.name || 'there'}! 👋 I'm your AI fitness coach. How can I help you today?`, time: '10:00 AM' }
  ]);

  // Mock data based on user profile
  const memberData = {
    name: currentUser?.name || 'Member',
    age: 28,
    weight: 72,
    height: 170,
    goal: 'Weight Loss',
    activity: 'Moderate',
    plan: currentUser?.plan || 'Premium',
    attendance: 22,
    lastWorkout: '2 days ago',
  };

  const workoutSuggestions = [
    {
      title: 'Fat Burn HIIT Circuit',
      duration: '30 min',
      intensity: 'High',
      calories: 320,
      exercises: [
        'Burpees - 3 sets × 15 reps',
        'Mountain Climbers - 3 sets × 30 sec',
        'Jump Squats - 3 sets × 12 reps',
        'High Knees - 3 sets × 30 sec',
        'Plank - 3 sets × 45 sec'
      ],
      reason: 'Based on your weight loss goal and moderate activity level.'
    },
    {
      title: 'Core Strength Builder',
      duration: '25 min',
      intensity: 'Medium',
      calories: 180,
      exercises: [
        'Crunches - 3 sets × 20 reps',
        'Russian Twists - 3 sets × 30 reps',
        'Leg Raises - 3 sets × 15 reps',
        'Side Plank - 3 sets × 30 sec each',
        'Dead Bug - 3 sets × 12 reps'
      ],
      reason: 'Building core strength supports overall fitness and injury prevention.'
    },
    {
      title: 'Cardio Endurance',
      duration: '40 min',
      intensity: 'Medium',
      calories: 400,
      exercises: [
        'Treadmill Run - 20 min (moderate pace)',
        'Rowing Machine - 10 min',
        'Cycling - 10 min',
        'Cool-down Walk - 5 min'
      ],
      reason: 'Improve cardiovascular health and endurance for sustained fat burn.'
    },
  ];

  const dietSuggestions = [
    {
      meal: 'Breakfast',
      time: '7:00 AM',
      option: 'Oats with Banana & Almonds',
      calories: 320,
      protein: '12g',
      carbs: '54g',
      fats: '8g',
      details: '½ cup oats, 1 banana, 10 almonds, cinnamon, honey'
    },
    {
      meal: 'Mid-Morning',
      time: '10:30 AM',
      option: 'Greek Yogurt & Berries',
      calories: 180,
      protein: '15g',
      carbs: '22g',
      fats: '4g',
      details: '1 cup Greek yogurt, mixed berries, 1 tsp chia seeds'
    },
    {
      meal: 'Lunch',
      time: '1:00 PM',
      option: 'Grilled Chicken Salad',
      calories: 420,
      protein: '35g',
      carbs: '28g',
      fats: '18g',
      details: '150g chicken breast, mixed greens, veggies, olive oil dressing'
    },
    {
      meal: 'Evening Snack',
      time: '4:30 PM',
      option: 'Protein Shake',
      calories: 220,
      protein: '24g',
      carbs: '18g',
      fats: '6g',
      details: '1 scoop whey protein, 200ml almond milk, 1 banana'
    },
    {
      meal: 'Dinner',
      time: '8:00 PM',
      option: 'Paneer Tikka with Brown Rice',
      calories: 480,
      protein: '28g',
      carbs: '52g',
      fats: '16g',
      details: '150g paneer, grilled veggies, 1 cup brown rice, mint chutney'
    },
  ];

  const insights = [
    { icon: Target, label: 'Goal Progress', value: '62%', change: '+8% this week', color: '#39FF14' },
    { icon: Dumbbell, label: 'Workouts This Month', value: memberData.attendance, change: 'Good consistency!', color: '#00D4FF' },
    { icon: TrendingUp, label: 'Calories Burned', value: '4,820', change: 'This week', color: '#FF6B00' },
    { icon: Activity, label: 'Avg Workout Duration', value: '42 min', change: '+5 min vs last month', color: '#A855F7' },
  ];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Mock AI response
    setTimeout(() => {
      const responses = [
        'Great question! For weight loss, I recommend combining HIIT workouts 3x per week with strength training 2x per week. This maximizes calorie burn while preserving muscle mass.',
        'Based on your current progress, I suggest increasing your protein intake to 1.6g per kg of body weight. This will help with recovery and muscle retention during fat loss.',
        'Your consistency is impressive! To break through plateaus, try progressive overload: gradually increase weights by 5-10% every 2 weeks.',
        'Recovery is just as important as training! Aim for 7-8 hours of sleep, stay hydrated (3L water daily), and consider active recovery days with yoga or walking.',
      ];
      const aiMsg = { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#39FF14] to-[#00D4FF] rounded-2xl flex items-center justify-center">
              <Bot size={24} className="text-gray-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">AI Coach</h1>
              <p className="text-gray-500 text-sm">Personalized fitness & nutrition guidance</p>
            </div>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-lg">
          <p className="text-xs text-[#39FF14] font-semibold flex items-center gap-1">
            <Zap size={12} /> AI-Powered
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className="text-2xl font-black text-white mb-1">{item.value}</p>
            <p className="text-xs text-gray-600">{item.change}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-2xl p-1.5">
        {[
          { id: 'suggestions', label: 'AI Suggestions', icon: Zap },
          { id: 'chat', label: 'Chat with Coach', icon: MessageCircle },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id ? 'bg-[#39FF14] text-gray-950' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          {/* Workout Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell size={18} className="text-[#39FF14]" />
              <h2 className="font-bold text-white text-lg">Recommended Workouts</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
              {workoutSuggestions.map((workout, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white">{workout.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      workout.intensity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      workout.intensity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>{workout.intensity}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>⏱️ {workout.duration}</span>
                    <span>🔥 {workout.calories} cal</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {workout.exercises.map((ex, j) => (
                      <div key={j} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="text-[#39FF14]">•</span>
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-800 pt-3 mb-4">
                    <p className="text-xs text-gray-500"><span className="text-[#39FF14]">💡 Why:</span> {workout.reason}</p>
                  </div>
                  <button className="w-full py-2 bg-[#39FF14] text-gray-950 font-bold rounded-lg hover:bg-[#39FF14]/90 transition-all text-sm">
                    Start Workout
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Diet Plan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Apple size={18} className="text-[#00D4FF]" />
              <h2 className="font-bold text-white text-lg">Today's Meal Plan</h2>
              <span className="text-xs text-gray-500">(Target: 1,620 cal | 114g protein)</span>
            </div>
            <div className="space-y-3">
              {dietSuggestions.map((meal, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
                        <Apple size={16} className="text-[#00D4FF]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{meal.meal}</h3>
                        <p className="text-xs text-gray-500">{meal.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-[#39FF14] font-bold">{meal.calories} cal</span>
                      <span className="text-gray-500">P: {meal.protein}</span>
                      <span className="text-gray-500">C: {meal.carbs}</span>
                      <span className="text-gray-500">F: {meal.fats}</span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-1">{meal.option}</p>
                      <p className="text-xs text-gray-500">{meal.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Daily Totals</p>
              <div className="flex justify-center gap-6">
                <div><span className="text-[#39FF14] font-black text-lg">1,620</span><span className="text-xs text-gray-500 ml-1">cal</span></div>
                <div><span className="text-[#00D4FF] font-black text-lg">114g</span><span className="text-xs text-gray-500 ml-1">protein</span></div>
                <div><span className="text-[#A855F7] font-black text-lg">174g</span><span className="text-xs text-gray-500 ml-1">carbs</span></div>
                <div><span className="text-[#FF6B00] font-black text-lg">52g</span><span className="text-xs text-gray-500 ml-1">fats</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col" style={{ height: '600px' }}>
          {/* Chat Header */}
          <div className="border-b border-gray-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#39FF14] to-[#00D4FF] rounded-full flex items-center justify-center">
              <Bot size={20} className="text-gray-950" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">AI Fitness Coach</p>
              <p className="text-xs text-[#39FF14] flex items-center gap-1"><span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" /> Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[#39FF14] text-gray-950' : 'bg-gray-800 text-white'} rounded-2xl px-4 py-3`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-gray-800' : 'text-gray-600'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about workouts, nutrition, progress..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50" />
              <button onClick={handleSendChat}
                className="w-12 h-12 bg-[#39FF14] text-gray-950 rounded-xl hover:bg-[#39FF14]/90 transition-all flex items-center justify-center flex-shrink-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
