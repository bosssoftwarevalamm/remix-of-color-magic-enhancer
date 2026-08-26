// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Shield, ChevronDown, Copy, Check, UserCheck, Pencil, Save, X, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type AccountRole = 'master' | 'super_admin';

interface AdminAccount {
  id: AccountRole;
  role: string;
  icon: any;
  color: string;
  email: string;
  password: string;
}

const DEFAULTS: AdminAccount[] = [
  {
    id: 'master',
    role: 'Master Admin',
    icon: Crown,
    color: 'from-purple-500 to-purple-700',
    email: 'manojcopy2065@gmail.com',
    password: 'SV#M8@MasterAdmin!2026$Secure^Access&91',
  },
  {
    id: 'super_admin',
    role: 'Super Admin',
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    email: 'hellosoftwarevala@gmail.com',
    password: 'SV#X9@UltraGodMode!2026$Root^Control&77',
  },
];

export const RoleSwitcherDropdown = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AdminAccount[]>(DEFAULTS);
  const [editingId, setEditingId] = useState<AccountRole | null>(null);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftPassword, setDraftPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [viewerRole, setViewerRole] = useState<string | null>(null);

  // Load credentials + viewer role
  const loadAccounts = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('master_super_admin_profiles')
        .select('account_role, account_email, account_password')
        .in('account_role', ['master', 'super_admin']);

      if (data && data.length) {
        setAccounts(prev =>
          prev.map(acc => {
            const row = data.find((r: any) => r.account_role === acc.id);
            return row?.account_email
              ? { ...acc, email: row.account_email, password: row.account_password ?? acc.password }
              : acc;
          })
        );
      }
    } catch {
      // silent — fall back to defaults
    }
  }, []);

  useEffect(() => {
    loadAccounts();

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      const roleList = (roles ?? []).map((r: any) => r.role);
      setViewerRole(roleList[0] ?? null);
      setCanEdit(roleList.includes('super_admin'));
    })();
  }, [loadAccounts]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setEditingId(null); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(null), 1500);
  };

  const startEdit = (acc: AdminAccount) => {
    if (!canEdit) {
      toast.error('Read-only — only Super Admin can update credentials');
      return;
    }
    setEditingId(acc.id);
    setDraftEmail(acc.email);
    setDraftPassword(acc.password);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftEmail('');
    setDraftPassword('');
  };

  const saveEdit = async (acc: AdminAccount) => {
    const email = draftEmail.trim();
    const password = draftPassword;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Credential-only update — touches no other columns
      const { error: upErr } = await supabase
        .from('master_super_admin_profiles')
        .update({ account_email: email, account_password: password, updated_at: new Date().toISOString() })
        .eq('account_role', acc.id);

      if (upErr) throw upErr;

      // Audit log entry — who, when, which account, what changed
      await supabase.from('audit_logs').insert({
        user_id: user?.id ?? null,
        module: 'security',
        action: 'admin_credentials_updated',
        meta_json: {
          target_account: acc.id,
          target_role_label: acc.role,
          changed_fields: [
            email !== acc.email ? 'email' : null,
            password !== acc.password ? 'password' : null,
          ].filter(Boolean),
          previous_email: acc.email,
          new_email: email,
          updated_by_role: viewerRole,
        },
      });

      setAccounts(prev => prev.map(a => (a.id === acc.id ? { ...a, email, password } : a)));
      toast.success(`${acc.role} credentials updated`);
      cancelEdit();
    } catch (e: any) {
      toast.error(e?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition text-xs font-medium"
      >
        <UserCheck className="w-3.5 h-3.5" />
        Admin Access
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); cancelEdit(); }} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-[440px] bg-[#12121a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-gray-800/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Authorized Admin Accounts</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Internal credentials — handle with care</div>
                </div>
                {!canEdit && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400/80 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5">
                    <Lock className="w-3 h-3" /> Read-only
                  </span>
                )}
              </div>

              <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
                {accounts.map(acc => {
                  const Icon = acc.icon;
                  const isEditing = editingId === acc.id;
                  return (
                    <div key={acc.id} className="rounded-lg border border-gray-800/80 bg-gray-900/40 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${acc.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white">{acc.role}</div>
                        </div>
                        {!isEditing ? (
                          <button
                            onClick={() => startEdit(acc)}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-md text-xs ${canEdit ? 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-300' : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'}`}
                            title={canEdit ? 'Update credentials' : 'Read-only'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => saveEdit(acc)}
                              disabled={saving}
                              className="p-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 disabled:opacity-50"
                              title="Save"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 rounded-md bg-gray-700/40 hover:bg-gray-700/60 text-gray-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <EditField label="Email" value={draftEmail} onChange={setDraftEmail} />
                          <EditField label="Password" value={draftPassword} onChange={setDraftPassword} mono />
                        </div>
                      ) : (
                        <>
                          <CredRow label="Email" value={acc.email} copied={copied === `${acc.id}-email`} onCopy={() => copy(`${acc.id}-email`, acc.email)} />
                          <CredRow label="Password" value={acc.password} mono copied={copied === `${acc.id}-pwd`} onCopy={() => copy(`${acc.id}-pwd`, acc.password)} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="px-3 py-2 border-t border-gray-800/70 text-[10px] text-gray-500 flex items-center justify-between">
                <span>Updates are logged to Security & Audit Logs</span>
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">ESC</kbd>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CredRow = ({ label, value, mono, copied, onCopy }: { label: string; value: string; mono?: boolean; copied: boolean; onCopy: () => void }) => (
  <div className="flex items-center gap-2 bg-black/30 rounded-md px-2 py-1.5">
    <span className="text-[10px] uppercase tracking-wider text-gray-500 w-16 flex-shrink-0">{label}</span>
    <span className={`flex-1 text-xs text-gray-200 truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
    <button onClick={onCopy} className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800/60">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  </div>
);

const EditField = ({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) => (
  <div className="flex items-center gap-2 bg-black/30 rounded-md px-2 py-1.5">
    <span className="text-[10px] uppercase tracking-wider text-gray-500 w-16 flex-shrink-0">{label}</span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`flex-1 bg-transparent border-none outline-none text-xs text-gray-100 ${mono ? 'font-mono' : ''}`}
      autoComplete="off"
      spellCheck={false}
    />
  </div>
);

export default RoleSwitcherDropdown;
