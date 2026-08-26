// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { 
  Mail, Lock, User, ArrowRight, Zap, Eye, EyeOff, CheckCircle2, ArrowLeft,
  Crown, Shield, Users, Server, Briefcase, UserCheck, 
  TrendingUp, Headphones, Code, DollarSign, 
  Loader2, AlertTriangle, Target, Scale,
  Megaphone, Search, BarChart3, Cpu, UserCog,
  Star, ShoppingCart, Store, MessageSquare, FileCheck,
  HandMetal, ClipboardCheck, MapPin, MonitorPlay, Gavel, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { useAnimationContext } from '@/contexts/AnimationContext';
import { activateDemoMode } from '@/utils/demoMode';

type AppRole = Database['public']['Enums']['app_role'];

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const roleOptions: { value: AppRole; label: string; description: string; icon: string }[] = [
  { value: 'user' as AppRole, label: 'User', description: 'Browse demos and purchase products', icon: '👤' },
  { value: 'prime', label: 'Prime User', description: 'Premium client with priority access', icon: '⭐' },
  { value: 'developer', label: 'Developer', description: 'Join as a developer to work on tasks', icon: '💻' },
  { value: 'franchise', label: 'Franchise', description: 'Become a franchise partner', icon: '🏢' },
  { value: 'reseller', label: 'Reseller', description: 'Start reselling our products', icon: '🤝' },
  { value: 'influencer', label: 'Influencer', description: 'Promote and earn commissions', icon: '📢' },
];

// ===== Blinking Eyes Component =====
const BlinkingEyes = ({ watching, passwordMode }: { watching: boolean; passwordMode: boolean }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const EyeBall = () => (
    <div className="relative w-14 h-14 bg-white rounded-full shadow-lg border-2 border-border/30 flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{
          scaleY: isBlinking ? 0.05 : 1,
          y: passwordMode ? 6 : 0,
        }}
        transition={{ duration: isBlinking ? 0.1 : 0.3 }}
        className="relative w-7 h-7"
      >
        {passwordMode ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-7 h-1 bg-foreground rounded-full" />
          </div>
        ) : (
          <motion.div
            animate={{ x: watching ? 3 : 0, y: watching ? 2 : 0 }}
            className="w-7 h-7 bg-foreground rounded-full flex items-center justify-center"
          >
            <div className="w-2.5 h-2.5 bg-white rounded-full relative -top-0.5 -left-0.5" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-5">
      <EyeBall />
      <EyeBall />
    </div>
  );
};

// ===== Demo Accounts =====
interface DemoAccount {
  id: string;
  role: string;
  icon: any;
  color: string;
  redirectPath: string;
  externalUrl?: string;
  tier: 'owner' | 'master' | 'admin' | 'manager' | 'staff';
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: 'ceo', role: 'AI CEO', icon: Bot, color: 'from-purple-600 to-indigo-700', redirectPath: '/ai-ceo', tier: 'owner' },
  { id: 'master', role: 'Master Admin', icon: Crown, color: 'from-purple-500 to-purple-700', redirectPath: '/master-admin', externalUrl: 'https://lovable.dev/projects/eb88320f-60a2-454f-b91f-9e255dd445d1', tier: 'master' },
  { id: 'super_admin', role: 'Super Admin', icon: Shield, color: 'from-amber-500 to-orange-600', redirectPath: '/super-admin', tier: 'admin' },
  { id: 'server_manager', role: 'Server Manager', icon: Server, color: 'from-slate-500 to-slate-700', redirectPath: '/server-manager', tier: 'manager' },
  { id: 'franchise', role: 'Franchise', icon: Briefcase, color: 'from-emerald-500 to-emerald-700', redirectPath: '/franchise', tier: 'manager' },
  { id: 'reseller', role: 'Reseller', icon: Store, color: 'from-teal-500 to-teal-700', redirectPath: '/reseller', tier: 'manager' },
  { id: 'area_manager', role: 'Area Manager', icon: MapPin, color: 'from-indigo-500 to-indigo-700', redirectPath: '/area-manager', tier: 'manager' },
  { id: 'demo_manager', role: 'Demo Manager', icon: MonitorPlay, color: 'from-cyan-500 to-cyan-700', redirectPath: '/demo-manager', tier: 'manager' },
  { id: 'product_demo_manager', role: 'Product Demo', icon: ShoppingCart, color: 'from-orange-500 to-orange-700', redirectPath: '/product-demo-manager', tier: 'manager' },
  { id: 'lead_manager', role: 'Lead Manager', icon: Target, color: 'from-rose-500 to-rose-700', redirectPath: '/lead-manager', tier: 'manager' },
  { id: 'task_manager', role: 'Task Manager', icon: ClipboardCheck, color: 'from-sky-500 to-sky-700', redirectPath: '/task-manager', tier: 'manager' },
  { id: 'finance_manager', role: 'Finance', icon: DollarSign, color: 'from-green-500 to-green-700', redirectPath: '/finance', tier: 'manager' },
  { id: 'marketing_manager', role: 'Marketing', icon: Megaphone, color: 'from-pink-500 to-pink-700', redirectPath: '/marketing-manager', tier: 'manager' },
  { id: 'seo_manager', role: 'SEO Manager', icon: Search, color: 'from-lime-500 to-lime-700', redirectPath: '/seo-manager', tier: 'manager' },
  { id: 'hr_manager', role: 'HR Manager', icon: UserCog, color: 'from-fuchsia-500 to-fuchsia-700', redirectPath: '/hr-manager', tier: 'manager' },
  { id: 'legal_manager', role: 'Legal', icon: Gavel, color: 'from-stone-500 to-stone-700', redirectPath: '/legal-manager', tier: 'manager' },
  { id: 'performance_manager', role: 'Performance', icon: BarChart3, color: 'from-violet-500 to-violet-700', redirectPath: '/performance', tier: 'manager' },
  { id: 'rnd_manager', role: 'R&D', icon: Cpu, color: 'from-amber-500 to-yellow-700', redirectPath: '/rnd-dashboard', tier: 'manager' },
  { id: 'ai_manager', role: 'AI Manager', icon: Zap, color: 'from-cyan-500 to-blue-700', redirectPath: '/api-manager', tier: 'manager' },
  { id: 'reseller_manager', role: 'Reseller Mgr', icon: Store, color: 'from-emerald-600 to-teal-700', redirectPath: '/reseller-manager', tier: 'manager' },
  { id: 'sales_support_manager', role: 'Sales Support', icon: TrendingUp, color: 'from-blue-600 to-indigo-700', redirectPath: '/sales-support-manager', tier: 'manager' },
  { id: 'influencer_manager', role: 'Creator Ops Manager', icon: Megaphone, color: 'from-pink-600 to-rose-700', redirectPath: '/influencer-manager-secure', tier: 'manager' },
  { id: 'assist_manager', role: 'Assist Mgr', icon: HandMetal, color: 'from-sky-600 to-blue-700', redirectPath: '/assist-manager', tier: 'manager' },
  { id: 'promise_management', role: 'Promise Mgmt', icon: FileCheck, color: 'from-teal-600 to-emerald-700', redirectPath: '/promise-management', tier: 'manager' },
  { id: 'developer', role: 'Developer', icon: Code, color: 'from-violet-500 to-violet-700', redirectPath: '/developer', tier: 'staff' },
  { id: 'influencer', role: 'Creator / Influencer', icon: Star, color: 'from-pink-500 to-pink-700', redirectPath: '/influencer', tier: 'staff' },
  { id: 'prime', role: 'Prime User', icon: Crown, color: 'from-amber-500 to-yellow-600', redirectPath: '/prime', tier: 'staff' },
  { id: 'user', role: 'User', icon: User, color: 'from-blue-400 to-blue-600', redirectPath: '/user-dashboard', tier: 'staff' },
  { id: 'client', role: 'Client', icon: Users, color: 'from-blue-500 to-cyan-600', redirectPath: '/client-portal', tier: 'staff' },
  { id: 'support', role: 'Support', icon: Headphones, color: 'from-green-500 to-emerald-700', redirectPath: '/support', tier: 'staff' },
  { id: 'client_success', role: 'Client Success', icon: MessageSquare, color: 'from-indigo-500 to-blue-700', redirectPath: '/client-success', tier: 'staff' },
  { id: 'safe_assist', role: 'Safe Assist', icon: Shield, color: 'from-cyan-500 to-teal-700', redirectPath: '/safe-assist', tier: 'staff' },
  { id: 'promise_tracker', role: 'Promise Track', icon: Eye, color: 'from-orange-500 to-red-700', redirectPath: '/promise-tracker', tier: 'staff' },
  { id: 'legal_compliance', role: 'Legal Comp.', icon: Scale, color: 'from-gray-500 to-gray-700', redirectPath: '/legal', tier: 'staff' },
  { id: 'incident_crisis', role: 'Crisis Mgmt', icon: AlertTriangle, color: 'from-red-500 to-red-700', redirectPath: '/incident-crisis', tier: 'staff' },
];

const TIER_CONFIG = [
  { key: 'owner', label: 'Owner & CEO', badge: 'bg-yellow-500/20 text-yellow-400' },
  { key: 'master', label: 'Root Authority', badge: 'bg-purple-500/20 text-purple-400' },
  { key: 'admin', label: 'Administrative', badge: 'bg-amber-500/20 text-amber-400' },
  { key: 'manager', label: 'Management', badge: 'bg-blue-500/20 text-blue-400' },
  { key: 'staff', label: 'Staff & Operations', badge: 'bg-emerald-500/20 text-emerald-400' },
];

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user' as AppRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [demoLoadingId, setDemoLoadingId] = useState<string | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { showWelcome, showWelcomeBack } = useAnimationContext();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (activeTab === 'signup' && !fullName.trim()) newErrors.name = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message.includes('Invalid login') ? 'Invalid email or password' : error.message);
        } else {
          showWelcomeBack(email.split('@')[0], 'default', 'SV-' + Math.random().toString(36).substring(2, 6).toUpperCase());
          setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
        }
      } else {
        const { error } = await signUp(email, password, selectedRole, fullName);
        if (error) {
          toast.error(error.message.includes('already registered') ? 'Email already registered. Please login.' : error.message);
        } else {
          showWelcome(fullName || email.split('@')[0], selectedRole);
          setTimeout(() => navigate('/dashboard', { replace: true }), 4000);
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (account: DemoAccount) => {
    if (account.externalUrl) {
      toast.success(`Opening ${account.role}...`);
      window.open(account.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setDemoLoadingId(account.id);
    activateDemoMode({
      id: account.id,
      role: account.id,
      email: `${account.id}@demo.softwarevala.com`,
      name: account.role,
    });
    toast.success(`✅ Logged in as ${account.role}`);
    setTimeout(() => {
      navigate(account.redirectPath);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center p-4 relative" style={{ pointerEvents: 'auto' }}>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header with Blinking Eyes */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-6 pt-4"
        >
          <BlinkingEyes watching={focusedField === 'email'} passwordMode={focusedField === 'password' && !showPassword} />
          <h1 className="text-2xl font-bold text-white mt-3">
            SOFTWARE <span className="text-purple-400">VALA</span>
          </h1>
          <p className="text-purple-300/60 text-sm mt-1">Control Center • 36 Role Dashboards</p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-800/80 rounded-xl p-1 border border-purple-500/20">
            {[
              { key: 'login' as const, label: '🔐 Login' },
              { key: 'signup' as const, label: '✨ Sign Up' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {(activeTab === 'login' || activeTab === 'signup') && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start max-w-4xl mx-auto"
            >
              <JoinPromoColumn />
              <div className="w-full bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === 'signup' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-purple-200 text-sm">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <Input
                            id="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="pl-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-slate-400"
                          />
                        </div>
                        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-purple-200 text-sm">Select Role</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {roleOptions.map((role) => (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => setSelectedRole(role.value)}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs ${
                                selectedRole === role.value
                                  ? 'border-purple-400 bg-purple-500/20'
                                  : 'border-purple-500/20 bg-slate-700/30 hover:border-purple-500/40'
                              }`}
                            >
                              <span>{role.icon}</span>
                              <span className="text-white font-medium">{role.label}</span>
                              {selectedRole === role.value && <CheckCircle2 className="w-3 h-3 text-purple-400 ml-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="auth-email" className="text-purple-200 text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <Input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@example.com"
                        className="pl-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-slate-400"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auth-password" className="text-purple-200 text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <Input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold h-11 rounded-xl"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                {activeTab === 'login' && (
                  <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-sm text-purple-400 hover:underline">Forgot password?</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-purple-400/60 hover:text-purple-300 inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// ===== Join Promo Column (animated advertising) =====
const PROMOS = [
  { icon: Code, title: 'Join as Developer', desc: 'Build & ship products. Earn from real tasks.', color: 'from-violet-500 to-indigo-600' },
  { icon: Briefcase, title: 'Become a Franchise', desc: 'Run your region. Own your growth.', color: 'from-emerald-500 to-teal-600' },
  { icon: Store, title: 'Reseller Partner', desc: 'Sell our software. Keep big margins.', color: 'from-amber-500 to-orange-600' },
  { icon: Star, title: 'Creator / Influencer', desc: 'Promote & earn lifetime commissions.', color: 'from-pink-500 to-rose-600' },
  { icon: Crown, title: 'Prime Membership', desc: 'Premium tools, priority support, VIP perks.', color: 'from-yellow-500 to-amber-600' },
];

const JoinPromoColumn = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % PROMOS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-4">
      <div className="relative h-[200px] rounded-2xl overflow-hidden border border-purple-500/20 bg-slate-800/60 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {PROMOS.map((p, i) => i === index && (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 p-5 flex flex-col justify-center bg-gradient-to-br ${p.color}`}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3"
              >
                <p.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-xl font-bold text-white">{p.title}</div>
              <div className="text-sm text-white/85 mt-1">{p.desc}</div>
              <Link to="/auth" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white bg-black/25 hover:bg-black/40 transition px-3 py-1.5 rounded-lg w-fit">
                Join Now <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {PROMOS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PROMOS.slice(0, 4).map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="rounded-xl border border-purple-500/20 bg-slate-800/50 p-3 cursor-pointer hover:border-purple-400/40 transition"
          >
            <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${p.color} flex items-center justify-center mb-1.5`}>
              <p.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-xs font-semibold text-white truncate">{p.title}</div>
            <div className="text-[10px] text-purple-300/60 mt-0.5">Apply →</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Auth;

