/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, School, X, Plus, ChevronRight, LogOut, ShieldCheck, Heart, Info, HelpCircle } from 'lucide-react';
import { UserPreferences } from '../types';

interface ProfileViewProps {
  userPrefs: UserPreferences;
  onUpdatePrefs: (updated: Partial<UserPreferences>) => void;
}

const ALLERGEN_OPTIONS = [
  '우유', '땅콩', '대두', '밀', '쇠고기', '돼지고기', '닭고기', '난류', '새우', '조개류'
];

export default function ProfileView({ userPrefs, onUpdatePrefs }: ProfileViewProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  
  const [tempName, setTempName] = useState(userPrefs.name);
  const [tempClass, setTempClass] = useState(userPrefs.gradeClass);

  const handleRemoveAllergy = (allergy: string) => {
    const updated = userPrefs.allergies.filter(a => a !== allergy);
    onUpdatePrefs({ allergies: updated });
  };

  const handleAddAllergy = (allergy: string) => {
    if (userPrefs.allergies.includes(allergy)) {
      handleRemoveAllergy(allergy);
    } else {
      onUpdatePrefs({ allergies: [...userPrefs.allergies, allergy] });
    }
  };

  const handleSaveBio = () => {
    if (!tempName.trim()) return;
    onUpdatePrefs({ name: tempName, gradeClass: tempClass });
    setShowEditName(false);
  };

  const handleLogout = () => {
    if (confirm('씨마스고등학교 급식 서비스에서 로그아웃하시겠습니까?')) {
      alert('안전하게 로그아웃 되었습니다. 게스트 상태로 유지됩니다.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      {/* Profile Bio Card with organic sage-green gradient */}
      <section className="mt-2 text-primary font-headline-title">
        <div className="bg-gradient-to-tr from-white to-[#dde8b2] rounded-3xl p-5 border border-[#c1cc98]/30 shadow-subtle flex items-center justify-between relative overflow-hidden custom-shadow">
          <div className="flex items-center gap-4 z-10">
            {/* Student Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0">
              <img 
                alt="Student Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK8jjOEx05zt-Joe1fO64hp_24OdOT3avqhEgHwLU_b32eYIQ7Ed9D8AaJph84WepKoPNFUJyNfO4J7iB6A-iND-MnO9FNtTyH5mtRrooJOIY7wfl92ctdgN4ZujlB1085O9r76QLw86chBx2MytInwIpHicteK7V90notl1HF2IL-2zf3mT3bmNAv4zIqyIjNcLLTD0AtqDrMBMbwmMhVEb3OOreuHn9tzne7h0cKteKsaykhdRyh3NvwKkKRDoZj3DArhBkbMg"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-bold text-lg text-primary flex items-center gap-1.5">
                {userPrefs.name}
              </span>
              <span className="text-on-surface-variant font-medium text-xs opacity-90 mt-0.5">
                {userPrefs.gradeClass}
              </span>
            </div>
          </div>
          
          <button 
            id="btn-edit-bio"
            onClick={() => {
              setTempName(userPrefs.name);
              setTempClass(userPrefs.gradeClass);
              setShowEditName(!showEditName);
            }}
            className="z-10 bg-white/75 hover:bg-white p-2.5 rounded-full transition-colors active:scale-95 shadow-sm text-primary"
            title="프로필 수정"
          >
            <Edit2 className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>

          {/* Graduation Cap Artistic Watermark background icon */}
          <div className="absolute -right-4 -bottom-4 text-emerald-800/10 pointer-events-none select-none z-0">
            <School className="w-28 h-28" />
          </div>
        </div>
      </section>

      {/* Edit Bio Form Card */}
      <AnimatePresence>
        {showEditName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-inner flex flex-col gap-4">
              <h4 className="font-bold text-sm text-primary">인적사항 수정</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">이름</label>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-surface-container-low px-4 py-2.5 rounded-xl text-sm border-2 border-transparent focus:border-primary focus:outline-none font-bold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">학반 정보</label>
                <input 
                  type="text" 
                  value={tempClass}
                  onChange={(e) => setTempClass(e.target.value)}
                  className="bg-surface-container-low px-4 py-2.5 rounded-xl text-sm border-2 border-transparent focus:border-primary focus:outline-none font-bold"
                />
              </div>

              <button 
                id="btn-save-bio"
                onClick={handleSaveBio}
                className="bg-primary text-on-primary font-bold py-2.5 rounded-xl text-xs active-scale"
              >
                저장하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Rules Settings list */}
      <section className="space-y-6">
        
        {/* Toggle Option 1: Allergy warnings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-bold text-base text-on-surface">알레르기 경고 알림</h3>
              <p className="text-[11px] text-on-surface-variant font-semibold opacity-75">
                식단에 유해 성분이 감지되면 요약 카드와 계산 화면에서 즉시 알림
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                id="toggle-allergy-notif"
                type="checkbox" 
                checked={userPrefs.allergyNotification}
                onChange={(e) => onUpdatePrefs({ allergyNotification: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Allergen management pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {userPrefs.allergies.map((allergy) => (
              <span 
                key={allergy}
                className="px-3 py-1.5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border border-[#c1cc98]/40 animate-fade-in"
              >
                {allergy}
                <button 
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="hover:bg-primary-container/20 p-0.5 rounded-full text-secondary stroke-[3]"
                  title="삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            
            <button 
              id="btn-add-allergy"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-3.5 py-1.5 border border-dashed border-outline hover:border-primary hover:text-primary text-on-surface-variant rounded-full text-xs font-semibold flex items-center gap-1 active-scale"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              추가하기
            </button>
          </div>

          {/* Expandable popup list of typical school allergens */}
          <AnimatePresence>
            {showAddMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface-container rounded-2xl p-4 border border-surface-container-highest flex flex-col gap-3 shadow-inner"
              >
                <div className="flex justify-between items-center border-b border-surface-container-highest pb-2">
                  <span className="text-xs font-extrabold text-primary flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    유형별 알레르기 목록 체크
                  </span>
                  <button 
                    onClick={() => setShowAddMenu(false)}
                    className="p-1 hover:bg-surface-container-lowest rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                  {ALLERGEN_OPTIONS.map((option) => {
                    const isAdded = userPrefs.allergies.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => handleAddAllergy(option)}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-center border transition-all ${
                          isAdded
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : 'bg-white text-on-surface-variant border-surface-container-highest hover:bg-stone-50'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  💡 식품위생법에 의거, 학교급식에 표시해야 하는 알레르기 유발 식품 중 자주 발병하는 식자재 목록입니다.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-[1px] bg-surface-container-highest w-full" />

        {/* Toggle Option 2: Daily Notification alerts */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-bold text-base text-on-surface font-headline-title">일일 식단 알림</h3>
            <p className="text-[11px] text-on-surface-variant font-semibold opacity-75">
              매일 아침 8시에 오늘의 식단표 신선한 알림 전달
            </p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              id="toggle-daily-notif"
              type="checkbox" 
              checked={userPrefs.dailyNotification}
              onChange={(e) => onUpdatePrefs({ dailyNotification: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        <div className="h-[1px] bg-surface-container-highest w-full" />

        {/* Support navigations */}
        <nav className="flex flex-col divide-y divide-surface-container-highest/60">
          <button 
            id="btn-link-help"
            onClick={() => alert('씨마스고 영양교사실 고객센터: 02-1234-5678\n언제든지 급식에 관한 의견을 남겨 주세요!')}
            className="w-full flex items-center justify-between py-3.5 active-scale text-left"
          >
            <span className="font-bold text-[14px] text-on-surface">고객센터 / 문의하기</span>
            <ChevronRight className="w-4 h-4 text-outline" />
          </button>
          
          <button 
            id="btn-link-terms"
            onClick={() => alert('웹 아카데믹 급식 플랫폼 이용 가이드\n본 서비스는 씨마스고등학교 학생 및 교직원을 위한 공식 학업 급식 지원용 복지 도구입니다.')}
            className="w-full flex items-center justify-between py-3.5 active-scale text-left"
          >
            <span className="font-bold text-[14px] text-on-surface">이용약관</span>
            <ChevronRight className="w-4 h-4 text-outline" />
          </button>
          
          <button 
            id="btn-logout"
            onClick={handleLogout}
            className="w-full flex items-center justify-between py-3.5 active-scale text-left text-error hover:text-error/80"
          >
            <span className="font-bold text-[14px]">로그아웃</span>
            <LogOut className="w-4 h-4 text-error" />
          </button>
        </nav>
      </section>

      {/* Official administrative footers */}
      <footer className="mt-4 pt-6 border-t border-surface-container-highest text-center text-primary/70">
        <div className="flex justify-center items-center gap-1.5 mb-1.5">
          <ShieldCheck className="w-4.5 h-4.5" />
          <span className="text-[11px] font-bold">건강하고 안심하는 급식 급여인증 필</span>
        </div>
        <p className="text-[10px] text-on-surface-variant opacity-75 font-semibold leading-relaxed whitespace-pre-line tracking-tight text-stone-500">
          © 2026 씨마스고등학교 급식
          건강하고 맛있는 학교 식단을 충실하게 지원합니다.
        </p>
      </footer>
    </motion.div>
  );
}
