import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, MapPin, Star, Phone, ArrowLeft,
  BookOpen, Dumbbell, Award, ChefHat, Music, Palette, Baby, Bike, Heart,
  GraduationCap, ChevronDown, ChevronLeft, ChevronRight, CheckCircle,
  Clock, Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "splash" | "region" | "category" | "list" | "detail" | "reservation" | "complete";
type SortType = "distance" | "reviews" | "price";
type DetailTab = "home" | "curriculum" | "location" | "reviews";
interface Region { sido: string; sigungu: string; eupmyeondong: string; }
interface Academy {
  id: number; name: string; category: string; image: string; images: string[];
  description: string; rating: number; reviewCount: number; distance: string;
  price: string; phone: string; address: string; hours: string;
  curriculum: { name: string; price: string; schedule: string }[];
  reviews: { name: string; rating: number; date: string; text: string }[];
}

// ─── Region Data ─────────────────────────────────────────────────────────────
const SIDO_LIST = ["서울특별시", "경기도", "부산광역시", "인천광역시", "대구광역시"];
const SIGUNGU_MAP: Record<string, string[]> = {
  "서울특별시": ["강남구", "강서구", "관악구", "광진구", "노원구", "마포구", "서초구", "성동구", "송파구", "종로구", "중구"],
  "경기도": ["고양시 일산서구", "남양주시", "성남시 분당구", "수원시 영통구", "양주시", "용인시 기흥구", "화성시"],
  "부산광역시": ["남구", "동래구", "부산진구", "수영구", "해운대구"],
  "인천광역시": ["남동구", "미추홀구", "부평구", "서구", "연수구"],
  "대구광역시": ["달서구", "동구", "북구", "수성구", "중구"],
};
const DONG_MAP: Record<string, string[]> = {
  "양주시": ["고읍동", "광사동", "덕계동", "덕정동", "마전동", "만송동", "봉양동", "옥정동", "율정동", "회정동"],
  "강남구": ["개포동", "논현동", "대치동", "도곡동", "삼성동", "압구정동", "역삼동", "청담동"],
  "해운대구": ["반송동", "반여동", "석대동", "송정동", "우동", "좌동", "중동"],
  "성남시 분당구": ["구미동", "금곡동", "대장동", "서현동", "수내동", "야탑동", "정자동"],
  "마포구": ["공덕동", "망원동", "상암동", "서교동", "성산동", "합정동"],
  "수원시 영통구": ["광교동", "매탄동", "신동", "영통동", "원천동", "이의동"],
  "남양주시": ["별내동", "오남읍", "와부읍", "진접읍", "화도읍"],
  "화성시": ["동탄1동", "동탄2동", "봉담읍", "향남읍"],
  "고양시 일산서구": ["대화동", "주엽동", "탄현동", "일산동"],
  "용인시 기흥구": ["구갈동", "기흥동", "보정동", "서천동", "언남동"],
};
const getDong = (sg: string) => DONG_MAP[sg] ?? ["가동", "나동", "다동", "라동", "마동"];

// ─── Category Data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "exam",    label: "입시·학원",     icon: GraduationCap, color: "#4F46E5", bg: "#EEF2FF" },
  { id: "fitness", label: "헬스·PT",       icon: Dumbbell,      color: "#DC2626", bg: "#FEF2F2" },
  { id: "martial", label: "태권도·유도",   icon: Award,         color: "#059669", bg: "#ECFDF5" },
  { id: "baking",  label: "베이킹·요리",   icon: ChefHat,       color: "#D97706", bg: "#FFFBEB" },
  { id: "cert",    label: "자격증",        icon: BookOpen,      color: "#7C3AED", bg: "#F5F3FF" },
  { id: "music",   label: "음악·악기",     icon: Music,         color: "#DB2777", bg: "#FDF2F8" },
  { id: "art",     label: "미술·공예",     icon: Palette,       color: "#0891B2", bg: "#ECFEFF" },
  { id: "kids",    label: "어린이교육",    icon: Baby,          color: "#EA580C", bg: "#FFF7ED" },
  { id: "yoga",    label: "요가·필라테스", icon: Heart,         color: "#E11D48", bg: "#FFF1F2" },
  { id: "sports",  label: "스포츠·레저",   icon: Bike,          color: "#16A34A", bg: "#F0FDF4" },
];

// ─── Academy Data ─────────────────────────────────────────────────────────────
const ACADEMIES: Academy[] = [
  {
    id: 1, name: "옥정 메가스터디 학원", category: "exam",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop&auto=format",
    ],
    description: "수능·내신 완벽 대비, 15년 전통의 입시 전문 학원",
    rating: 4.8, reviewCount: 124, distance: "0.3km", price: "월 28만원~",
    phone: "031-123-4567", address: "경기도 양주시 옥정동 12-34 옥정빌딩 3층",
    hours: "월~금 14:00~22:00 | 토 09:00~18:00 | 일 휴무",
    curriculum: [
      { name: "수학 심화반",  price: "월 32만원", schedule: "월·수·금 18:00~20:00" },
      { name: "영어 독해반",  price: "월 28만원", schedule: "화·목 18:00~20:00" },
      { name: "국어 문학반",  price: "월 25만원", schedule: "월·수 20:00~22:00" },
      { name: "통합 패키지",  price: "월 72만원", schedule: "주 5회" },
    ],
    reviews: [
      { name: "김수민", rating: 5, date: "2025.06.12", text: "선생님이 정말 친절하시고 설명을 잘 해주셔서 수학 점수가 많이 올랐어요!" },
      { name: "이준혁", rating: 5, date: "2025.05.28", text: "내신 관리부터 수능까지 체계적으로 준비할 수 있어서 좋습니다." },
      { name: "박지영", rating: 4, date: "2025.05.10", text: "커리큘럼이 탄탄하고 자료도 풍부해요. 조금 비싸지만 그만한 가치가 있어요." },
    ],
  },
  {
    id: 2, name: "바디핏 PT센터 옥정점", category: "fitness",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop&auto=format",
    ],
    description: "최신 기구와 전문 트레이너의 1:1 맞춤 PT 서비스",
    rating: 4.6, reviewCount: 89, distance: "0.7km", price: "월 8만원~",
    phone: "031-234-5678", address: "경기도 양주시 옥정동 56-78 스포츠센터 2층",
    hours: "월~금 06:00~23:00 | 주말 07:00~21:00",
    curriculum: [
      { name: "일반 헬스 회원권",  price: "월 8만원",  schedule: "자유 이용" },
      { name: "1:1 PT 10회권",     price: "38만원",    schedule: "예약제 운영" },
      { name: "1:1 PT 30회권",     price: "99만원",    schedule: "예약제 운영" },
      { name: "그룹 PT (주 3회)",  price: "월 15만원", schedule: "월·수·금 07:00 / 19:00" },
    ],
    reviews: [
      { name: "최민준", rating: 5, date: "2025.06.20", text: "트레이너 쌤이 정말 전문적이에요. 체형 교정부터 다이어트까지 완벽합니다!" },
      { name: "정혜린", rating: 4, date: "2025.06.05", text: "시설이 깔끔하고 기구도 많아요. 출퇴근 시간대는 조금 붐비는 편이에요." },
    ],
  },
  {
    id: 3, name: "챔피언 태권도장", category: "martial",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=500&fit=crop&auto=format",
    ],
    description: "아이부터 성인까지, 단계별 체계적인 태권도 교육",
    rating: 4.9, reviewCount: 67, distance: "1.2km", price: "월 9만원~",
    phone: "031-345-6789", address: "경기도 양주시 옥정동 90-12 태권도빌딩 1층",
    hours: "월~금 16:00~21:00 | 토 10:00~14:00 | 일 휴무",
    curriculum: [
      { name: "어린이반 (초등)", price: "월 9만원",  schedule: "월~금 17:00~18:00" },
      { name: "청소년반 (중·고)", price: "월 11만원", schedule: "월~금 19:00~20:30" },
      { name: "성인반",          price: "월 12만원", schedule: "월·수·금 20:30~22:00" },
    ],
    reviews: [
      { name: "오승준", rating: 5, date: "2025.06.15", text: "관장님이 아이들을 정말 열정적으로 가르치세요. 집중력이 많이 좋아졌어요!" },
      { name: "황나래", rating: 5, date: "2025.05.30", text: "예의범절도 같이 가르쳐주셔서 아이가 많이 성숙해진 것 같아요." },
    ],
  },
  {
    id: 4, name: "마망 베이킹 스튜디오", category: "baking",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=500&fit=crop&auto=format",
    ],
    description: "홈베이킹부터 창업까지, 프랑스 정통 베이킹 클래스",
    rating: 4.7, reviewCount: 43, distance: "1.5km", price: "월 15만원~",
    phone: "031-456-7890", address: "경기도 양주시 옥정동 23-45 상가 2층",
    hours: "화~일 10:00~20:00 | 월요일 휴무",
    curriculum: [
      { name: "기초 베이킹반",  price: "월 15만원 (4회)", schedule: "주 1회 선택" },
      { name: "케이크 데코반",  price: "월 22만원 (4회)", schedule: "주 1회 선택" },
      { name: "창업 전문반",   price: "월 45만원 (8회)", schedule: "주 2회" },
    ],
    reviews: [
      { name: "강지수", rating: 5, date: "2025.06.18", text: "소규모로 운영해서 선생님이 바로바로 봐주세요. 완성도가 정말 높아요!" },
      { name: "윤미래", rating: 4, date: "2025.05.22", text: "재료도 고급지고 레시피도 상세하게 알려줘서 집에서도 따라하기 쉬워요." },
    ],
  },
  {
    id: 5, name: "옥정 자격증 아카데미", category: "cert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&auto=format",
    ],
    description: "ITQ·컴활·한국사 등 각종 자격증 단기 합격반",
    rating: 4.5, reviewCount: 56, distance: "0.9km", price: "월 12만원~",
    phone: "031-567-8901", address: "경기도 양주시 옥정동 45-67 옥정타워 5층",
    hours: "월~토 09:00~21:00 | 일 10:00~18:00",
    curriculum: [
      { name: "컴퓨터활용능력 1급", price: "월 15만원", schedule: "월·수·금 10:00~12:00" },
      { name: "ITQ 패키지",        price: "월 12만원", schedule: "화·목 14:00~16:00" },
      { name: "한국사능력검정",    price: "월 10만원", schedule: "토 10:00~13:00" },
    ],
    reviews: [
      { name: "송철수", rating: 5, date: "2025.06.01", text: "시험 합격률이 높아서 믿고 다닐 수 있어요. 선생님도 친절하세요." },
    ],
  },
];

const TIME_SLOTS = ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Stars({ rating, md }: { rating: number; md?: boolean }) {
  const sz = md ? 16 : 12;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} style={{ width: sz, height: sz }}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </span>
  );
}

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen({ phase }: { phase: "logo" | "fading" }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#FF5A36]"
    >
      <motion.div
        initial={{ scale: 0.55, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="w-24 h-24 bg-white rounded-[28px] flex items-center justify-center shadow-2xl">
          <Search className="text-[#FF5A36]" style={{ width: 44, height: 44 }} strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <p className="text-[44px] font-black text-white tracking-tight leading-none">Class Peek</p>
          <p className="text-white/65 text-sm mt-2 font-medium tracking-widest uppercase">내 동네 배움터를 한눈에</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="absolute bottom-14 flex gap-2"
      >
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Region ───────────────────────────────────────────────────────────────────
function RegionScreen({ region, setRegion, onDone }: {
  region: Region; setRegion: (r: Region) => void; onDone: () => void;
}) {
  const [step, setStep] = useState<"sido" | "sigungu" | "dong">("sido");

  const pickSido = (sido: string) => {
    setRegion({ sido, sigungu: "", eupmyeondong: "" });
    setStep("sigungu");
  };
  const pickSigungu = (sigungu: string) => {
    setRegion({ ...region, sigungu, eupmyeondong: "" });
    setStep("dong");
  };
  const pickDong = (eupmyeondong: string) => {
    setRegion({ ...region, eupmyeondong });
    setTimeout(onDone, 280);
  };

  const stepLabel = step === "sido" ? "시 / 도" : step === "sigungu" ? "시 / 군 / 구" : "읍 / 면 / 동";
  const list = step === "sido" ? SIDO_LIST
    : step === "sigungu" ? (SIGUNGU_MAP[region.sido] ?? [])
    : getDong(region.sigungu);

  return (
    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.32 }}
      className="absolute inset-0 bg-white flex flex-col">

      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-[#FF5A36] rounded-lg flex items-center justify-center">
            <Search className="text-white" style={{ width: 14, height: 14 }} strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg text-gray-900 tracking-tight">Class Peek</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900">어디서 배울까요?</h2>
        <p className="text-sm text-gray-500 mt-1">탐색할 지역을 선택해주세요</p>
      </div>

      {/* Breadcrumb chips */}
      {region.sido && (
        <div className="px-6 mb-3 flex items-center gap-2 flex-wrap">
          <button onClick={() => { setStep("sido"); setRegion({ sido: "", sigungu: "", eupmyeondong: "" }); }}
            className="px-3 py-1.5 bg-[#FF5A36] text-white rounded-full text-xs font-bold">
            {region.sido}
          </button>
          {region.sigungu && (
            <>
              <ChevronRight className="text-gray-400" style={{ width: 14, height: 14 }} />
              <button onClick={() => { setStep("sigungu"); setRegion({ ...region, sigungu: "", eupmyeondong: "" }); }}
                className="px-3 py-1.5 bg-[#FF5A36] text-white rounded-full text-xs font-bold">
                {region.sigungu}
              </button>
            </>
          )}
        </div>
      )}

      {/* Step label */}
      <div className="px-6 mb-2">
        <span className="text-[11px] font-black text-[#FF5A36] uppercase tracking-widest">{stepLabel}</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="space-y-2">
          {list.map(item => (
            <button key={item}
              onClick={() => step === "sido" ? pickSido(item) : step === "sigungu" ? pickSigungu(item) : pickDong(item)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition-all active:scale-[0.98] ${
                region.eupmyeondong === item && step === "dong"
                  ? "border-[#FF5A36] bg-[#FFF5F3]"
                  : "border-gray-100 hover:border-[#FF5A36]/40 hover:bg-[#FFF5F3]"
              }`}>
              <div className="flex items-center gap-3">
                <MapPin className="text-[#FF5A36]" style={{ width: 15, height: 15 }} />
                <span className="font-semibold text-gray-900 text-sm">{item}</span>
              </div>
              <ChevronRight className="text-gray-400" style={{ width: 15, height: 15 }} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Category ─────────────────────────────────────────────────────────────────
function CategoryScreen({ regionLabel, onSelect }: { regionLabel: string; onSelect: (id: string) => void; }) {
  const [q, setQ] = useState("");
  return (
    <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-[#F6F7F9] flex flex-col">

      {/* Top bar */}
      <div className="bg-white px-5 pt-3 pb-4 shadow-sm">
        <button className="flex items-center gap-1.5 mb-3 group">
          <MapPin className="text-[#FF5A36]" style={{ width: 14, height: 14 }} />
          <span className="text-sm font-bold text-gray-800">{regionLabel}</span>
          <ChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors" style={{ width: 13, height: 13 }} />
        </button>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="학원, 센터, 스튜디오 검색"
            className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#FF5A36]/25 transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8">
        <h3 className="font-black text-gray-900 mb-4">어떤 배움을 찾으시나요?</h3>
        <div className="grid grid-cols-3 gap-3 mb-7">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => onSelect(cat.id)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md active:scale-95 transition-all">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.bg }}>
                  <Icon style={{ width: 28, height: 28, color: cat.color }} />
                </div>
                <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Popular picks */}
        <h3 className="font-black text-gray-900 mb-3">이 지역 인기 클래스</h3>
        <div className="space-y-3">
          {ACADEMIES.slice(0, 2).map(a => (
            <button key={a.id} onClick={() => onSelect(a.category)}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left">
              <img src={a.image} alt={a.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{a.name}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{a.description}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="fill-amber-400 text-amber-400" style={{ width: 11, height: 11 }} />
                  <span className="text-xs font-bold text-gray-800">{a.rating}</span>
                  <span className="text-xs text-gray-400">({a.reviewCount})</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{a.distance}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────
function ListScreen({ academies, category, sortBy, setSortBy, onBack, onSelect }: {
  academies: Academy[];
  category?: typeof CATEGORIES[0];
  sortBy: SortType; setSortBy: (s: SortType) => void;
  onBack: () => void; onSelect: (a: Academy) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-[#F6F7F9] flex flex-col">

      {/* Header */}
      <div className="bg-white px-4 pt-2 pb-3 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 -ml-1 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">
            <ArrowLeft style={{ width: 20, height: 20 }} className="text-gray-700" />
          </button>
          {category && (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: category.bg }}>
              <category.icon style={{ width: 16, height: 16, color: category.color }} />
            </div>
          )}
          <h2 className="font-black text-lg text-gray-900">{category?.label ?? "전체"}</h2>
          <span className="ml-auto text-sm text-gray-400 font-medium">{academies.length}개</span>
        </div>
        <div className="flex gap-2">
          {([["distance", "거리순"], ["reviews", "후기 많은 순"], ["price", "가격 낮은 순"]] as [SortType, string][]).map(([v, l]) => (
            <button key={v} onClick={() => setSortBy(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                sortBy === v ? "bg-[#FF5A36] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-6 space-y-3">
        {academies.map(a => (
          <button key={a.id} onClick={() => onSelect(a)}
            className="w-full text-left bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md active:scale-[0.98] transition-all">
            <img src={a.image} alt={a.name} className="w-full h-44 object-cover bg-gray-100" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black text-gray-900 text-base leading-snug">{a.name}</h3>
                <span className="text-xs font-bold text-[#FF5A36] whitespace-nowrap shrink-0 mt-0.5">{a.price}</span>
              </div>
              <p className="text-sm text-gray-500 leading-snug mb-2.5">{a.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="fill-amber-400 text-amber-400" style={{ width: 13, height: 13 }} />
                  <span className="text-sm font-black text-gray-900">{a.rating}</span>
                  <span className="text-xs text-gray-400 ml-0.5">({a.reviewCount})</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1">
                  <MapPin className="text-gray-400" style={{ width: 11, height: 11 }} />
                  <span className="text-xs text-gray-500">{a.distance}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Detail ───────────────────────────────────────────────────────────────────
function DetailScreen({ academy, tab, setTab, photoIndex, setPhotoIndex, onBack, onReserve }: {
  academy: Academy; tab: DetailTab; setTab: (t: DetailTab) => void;
  photoIndex: number; setPhotoIndex: (i: number) => void;
  onBack: () => void; onReserve: () => void;
}) {
  const TABS: [DetailTab, string][] = [["home", "홈/소개"], ["curriculum", "커리큘럼"], ["location", "위치/지도"], ["reviews", "리뷰"]];

  return (
    <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-white flex flex-col">

      {/* Photo carousel */}
      <div className="relative shrink-0 bg-gray-100" style={{ height: 220 }}>
        <motion.img key={photoIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={academy.images[photoIndex]} alt={academy.name}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Back */}
        <button onClick={onBack}
          className="absolute top-3 left-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all">
          <ArrowLeft style={{ width: 17, height: 17 }} className="text-gray-800" />
        </button>

        {/* Prev / Next */}
        {photoIndex > 0 && (
          <button onClick={() => setPhotoIndex(photoIndex - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/75 rounded-full flex items-center justify-center shadow active:scale-90 transition-all">
            <ChevronLeft style={{ width: 15, height: 15 }} className="text-gray-700" />
          </button>
        )}
        {photoIndex < academy.images.length - 1 && (
          <button onClick={() => setPhotoIndex(photoIndex + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/75 rounded-full flex items-center justify-center shadow active:scale-90 transition-all">
            <ChevronRight style={{ width: 15, height: 15 }} className="text-gray-700" />
          </button>
        )}

        {/* Dots */}
        {academy.images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
            {academy.images.map((_, i) => (
              <button key={i} onClick={() => setPhotoIndex(i)}
                className={`rounded-full transition-all ${i === photoIndex ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
            ))}
          </div>
        )}

        {/* Name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white font-black text-xl leading-tight drop-shadow-lg">{academy.name}</h2>
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5">
          <Star className="fill-amber-400 text-amber-400" style={{ width: 14, height: 14 }} />
          <span className="font-black text-sm text-gray-900">{academy.rating}</span>
          <span className="text-xs text-gray-400">({academy.reviewCount})</span>
        </div>
        <div className="w-px h-3.5 bg-gray-200" />
        <div className="flex items-center gap-1">
          <MapPin className="text-[#FF5A36]" style={{ width: 12, height: 12 }} />
          <span className="text-xs text-gray-500 font-medium">{academy.distance}</span>
        </div>
        <div className="w-px h-3.5 bg-gray-200" />
        <span className="text-sm font-black text-[#FF5A36]">{academy.price}</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 shrink-0">
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-[11px] font-bold transition-all ${
              tab === id ? "text-[#FF5A36] border-b-2 border-[#FF5A36]" : "text-gray-400"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {tab === "home" && (
          <div className="px-5 py-4 space-y-5">
            <div>
              <p className="text-[11px] font-black text-[#FF5A36] uppercase tracking-widest mb-1.5">소개</p>
              <p className="text-sm text-gray-600 leading-relaxed">{academy.description}</p>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#FF5A36] uppercase tracking-widest mb-1.5">운영 시간</p>
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-2xl p-3.5">
                <Clock className="text-[#FF5A36] shrink-0 mt-0.5" style={{ width: 15, height: 15 }} />
                <p className="text-sm text-gray-600 leading-relaxed">{academy.hours}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#FF5A36] uppercase tracking-widest mb-1.5">전화 번호</p>
              <a href={`tel:${academy.phone}`} className="flex items-center gap-2 text-sm font-bold text-[#FF5A36]">
                <Phone style={{ width: 15, height: 15 }} />
                {academy.phone}
              </a>
            </div>
          </div>
        )}

        {tab === "curriculum" && (
          <div className="px-5 py-4">
            <p className="text-[11px] font-black text-[#FF5A36] uppercase tracking-widest mb-3">수업 및 가격 안내</p>
            <div className="space-y-3">
              {academy.curriculum.map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-gray-900">{c.name}</span>
                    <span className="font-black text-sm text-[#FF5A36] whitespace-nowrap">{c.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="text-gray-400" style={{ width: 11, height: 11 }} />
                    <span className="text-xs text-gray-500">{c.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "location" && (
          <div className="px-5 py-4">
            <p className="text-[11px] font-black text-[#FF5A36] uppercase tracking-widest mb-3">위치 안내</p>
            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-emerald-50 to-sky-50 flex flex-col items-center justify-center gap-3" style={{ height: 180 }}>
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#FF5A36]/10 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#FF5A36]/20 flex items-center justify-center">
                    <MapPin className="text-[#FF5A36]" style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <span className="absolute inset-0 rounded-full border-2 border-[#FF5A36]/30 animate-ping" />
              </div>
              <p className="text-xs text-gray-500 font-semibold">지도 보기</p>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="text-[#FF5A36] shrink-0 mt-0.5" style={{ width: 14, height: 14 }} />
              <p className="text-sm text-gray-600 leading-relaxed">{academy.address}</p>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-4 mb-5 bg-gray-50 rounded-2xl p-4">
              <div className="text-center">
                <p className="text-4xl font-black text-gray-900 leading-none">{academy.rating}</p>
                <Stars rating={academy.rating} md />
                <p className="text-xs text-gray-500 mt-1">후기 {academy.reviewCount}개</p>
              </div>
            </div>
            <div className="space-y-3">
              {academy.reviews.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FF5A36]/15 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-[#FF5A36]">{r.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{r.name}</p>
                        <Stars rating={r.rating} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex gap-3">
          <a href={`tel:${academy.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[#FF5A36] text-[#FF5A36] font-black text-sm active:scale-95 transition-all">
            <Phone style={{ width: 16, height: 16 }} />
            전화 문의
          </a>
          <button onClick={onReserve}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#FF5A36] text-white font-black text-sm active:scale-95 transition-all shadow-lg shadow-[#FF5A36]/35">
            <Calendar style={{ width: 16, height: 16 }} />
            상담 예약하기
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Reservation ──────────────────────────────────────────────────────────────
function ReservationScreen({ academy, form, setForm, onBack, onSubmit }: {
  academy: Academy;
  form: { name: string; phone: string; date: string; time: string };
  setForm: (f: typeof form) => void;
  onBack: () => void; onSubmit: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const valid = form.name && form.phone && form.date && form.time;

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }} transition={{ duration: 0.32 }}
      className="absolute inset-0 bg-[#F6F7F9] flex flex-col">

      {/* Header */}
      <div className="bg-white px-4 pt-2 pb-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-1 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">
            <ArrowLeft style={{ width: 20, height: 20 }} className="text-gray-700" />
          </button>
          <h2 className="font-black text-lg text-gray-900">상담 예약</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-8">
        {/* Academy chip */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <img src={academy.image} alt={academy.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" />
          <div className="min-w-0">
            <p className="font-black text-sm text-gray-900 truncate">{academy.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{academy.description}</p>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <p className="font-black text-sm text-gray-900">예약자 정보</p>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">이름</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF5A36]/30 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">연락처</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="010-0000-0000"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF5A36]/30 transition-all" />
          </div>
        </div>

        {/* Date & time */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <p className="font-black text-sm text-gray-900">방문 희망 일시</p>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">날짜</label>
            <input type="date" value={form.date} min={today} onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF5A36]/30 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">시간 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(t => (
                <button key={t} onClick={() => setForm({ ...form, time: t })}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    form.time === t
                      ? "bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onSubmit} disabled={!valid}
          className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${
            valid ? "bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}>
          예약 완료하기
        </button>
      </div>
    </motion.div>
  );
}

// ─── Complete ─────────────────────────────────────────────────────────────────
function CompleteScreen({ onHome }: { onHome: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.4, type: "spring", stiffness: 220, damping: 24 }}
      className="absolute inset-0 bg-white flex flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -160 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-7">
        <CheckCircle className="text-green-500" style={{ width: 48, height: 48 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
        <h2 className="text-2xl font-black text-gray-900 mb-3 leading-snug">
          예약이<br />완료되었습니다!
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          학원에서 확인 후 연락드릴 예정입니다.<br />
          방문 전 미리 연락을 드릴 수 있으니<br />
          조금만 기다려 주세요.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58 }} className="mt-12 w-full">
        <button onClick={onHome}
          className="w-full py-4 bg-[#FF5A36] text-white font-black rounded-2xl active:scale-95 transition-all shadow-lg shadow-[#FF5A36]/30">
          다른 학원 찾아보기
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]             = useState<Screen>("splash");
  const [splashPhase, setSplashPhase]   = useState<"logo" | "fading">("logo");
  const [region, setRegion]             = useState<Region>({ sido: "", sigungu: "", eupmyeondong: "" });
  const [category, setCategory]         = useState("");
  const [academy, setAcademy]           = useState<Academy | null>(null);
  const [sortBy, setSortBy]             = useState<SortType>("distance");
  const [tab, setTab]                   = useState<DetailTab>("home");
  const [photoIndex, setPhotoIndex]     = useState(0);
  const [form, setForm]                 = useState({ name: "", phone: "", date: "", time: "" });

  useEffect(() => {
    if (screen !== "splash") return;
    const t1 = setTimeout(() => setSplashPhase("fading"), 2000);
    const t2 = setTimeout(() => setScreen("region"), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [screen]);

  const splashActive = screen === "splash";

  const regionLabel = region.eupmyeondong
    ? `${region.sido.replace("특별시", "").replace("광역시", "")} ${region.sigungu} ${region.eupmyeondong}`
    : "지역 선택";

  const filteredAcademies = ACADEMIES
    .filter(a => !category || a.category === category)
    .sort((a, b) =>
      sortBy === "distance" ? parseFloat(a.distance) - parseFloat(b.distance)
      : sortBy === "reviews" ? b.reviewCount - a.reviewCount
      : parseInt(a.price) - parseInt(b.price)
    );

  return (
    <div className="min-h-screen bg-[#E8EAF0] flex items-center justify-center p-6">
      {/* Phone shell */}
      <div className="w-[390px] h-[844px] rounded-[46px] overflow-hidden relative flex flex-col"
        style={{ boxShadow: "0 36px 90px rgba(0,0,0,0.30), 0 0 0 1px rgba(0,0,0,0.08) inset" }}>

        {/* Status bar */}
        <div className={`h-12 flex items-center justify-between px-7 shrink-0 relative z-20 transition-colors duration-300 ${splashActive ? "bg-[#FF5A36] text-white" : "bg-white text-gray-900"}`}>
          <span className="text-xs font-black">9:41</span>
          <div className={`w-28 h-5 rounded-full absolute left-1/2 -translate-x-1/2 ${splashActive ? "bg-[#e04520]" : "bg-black"}`} />
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3.5">
              {[2, 4, 6, 9, 12].map((h, i) => (
                <div key={i} className={`w-1 rounded-sm ${splashActive ? "bg-white" : "bg-gray-900"}`} style={{ height: h }} />
              ))}
            </div>
            <div className={`w-6 h-3 border rounded-sm relative ${splashActive ? "border-white" : "border-gray-900"}`}>
              <div className={`absolute inset-[2px] right-[5px] rounded-sm ${splashActive ? "bg-white" : "bg-gray-900"}`} />
              <div className={`absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 rounded-r-sm ${splashActive ? "bg-white" : "bg-gray-900"}`} />
            </div>
          </div>
        </div>

        {/* Screens */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {screen === "splash" && <SplashScreen key="splash" phase={splashPhase} />}
            {screen === "region" && (
              <RegionScreen key="region" region={region} setRegion={setRegion}
                onDone={() => setScreen("category")} />
            )}
            {screen === "category" && (
              <CategoryScreen key="category" regionLabel={regionLabel}
                onSelect={id => { setCategory(id); setScreen("list"); }} />
            )}
            {screen === "list" && (
              <ListScreen key="list" academies={filteredAcademies}
                category={CATEGORIES.find(c => c.id === category)}
                sortBy={sortBy} setSortBy={setSortBy}
                onBack={() => setScreen("category")}
                onSelect={a => { setAcademy(a); setPhotoIndex(0); setTab("home"); setScreen("detail"); }} />
            )}
            {screen === "detail" && academy && (
              <DetailScreen key="detail" academy={academy} tab={tab} setTab={setTab}
                photoIndex={photoIndex} setPhotoIndex={setPhotoIndex}
                onBack={() => setScreen("list")}
                onReserve={() => setScreen("reservation")} />
            )}
            {screen === "reservation" && academy && (
              <ReservationScreen key="reservation" academy={academy} form={form} setForm={setForm}
                onBack={() => setScreen("detail")}
                onSubmit={() => { if (form.name && form.phone && form.date && form.time) setScreen("complete"); }} />
            )}
            {screen === "complete" && (
              <CompleteScreen key="complete"
                onHome={() => { setScreen("category"); setForm({ name: "", phone: "", date: "", time: "" }); }} />
            )}
          </AnimatePresence>
        </div>

        {/* Home indicator */}
        <div className={`h-8 flex items-center justify-center shrink-0 transition-colors duration-300 ${splashActive ? "bg-[#FF5A36]" : "bg-white"}`}>
          <div className={`w-32 h-1 rounded-full ${splashActive ? "bg-white/40" : "bg-gray-300"}`} />
        </div>
      </div>
    </div>
  );
}
