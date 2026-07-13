import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const ClassPeekApp());
}

class ClassPeekApp extends StatelessWidget {
  const ClassPeekApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Class Peek',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(scaffoldBackgroundColor: Colors.white),
      home: const Screen1Splash(), // 1번 화면(시작 화면)부터 출발!
    );
  }
}

// ==========================================
// 1번 화면: 로딩 & 단계별 지역구 선택 (Mission 색상)
// ==========================================
class Screen1Splash extends StatefulWidget {
  const Screen1Splash({super.key});

  @override
  State<Screen1Splash> createState() => _Screen1SplashState();
}

class _Screen1SplashState extends State<Screen1Splash> {
  String? selectedSiDo;
  String? selectedSiGunGu;
  String? selectedEupMyeonDong;

  // 1. 시/도 목록
  final List<String> siDoList = ['경기도', '서울특별시'];

  // 2. ✨ 핵심: 시/도별 산하 시/군/구 데이터 맵 (경기도일 때만 양주, 의정부, 동두천이 나오도록)
  final Map<String, List<String>> cityMap = {
    '경기도': ['양주시', '의정부시', '동두천시'],
    '서울특별시': ['강남구', '서초구', '송파구'], // 추후 확장용 임시 데이터
  };

  // 3. 각 시별 산하 읍/면/동 데이터 맵
  final Map<String, List<String>> areaMap = {
    '양주시': ['옥정동', '고읍동', '덕정동', '삼숭동', '백석읍'],
    '의정부시': ['의정부동', '호원동', '장암동', '가능동', '녹양동', '신곡동', '송산동', '자금동', '흥선동'],
    '동두천시': ['생연동', '중앙동', '송내동'],
  };

  @override
  Widget build(BuildContext context) {
    // 🎨 이미지의 Mission 단계: 가장 연하고 부드러운 스카이 블루
    const missionBackgroundColor = Color(0xFFD2F0FF);

    return Scaffold(
      backgroundColor: missionBackgroundColor,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // 1. 상단 타이틀 문구 (둥글둥글하고 통통한 Do Hyeon 서체 적용!)
                Text(
                  '더 나은 선택을 위한',
                  style: GoogleFonts.doHyeon(
                    fontSize: 18, // 글씨 크기를 16에서 18로 살짝 키웠어요!
                    fontWeight: FontWeight.w600, // 더 도톰하고 명확하게 두께를 주었습니다.
                    color: const Color.fromARGB(
                      255,
                      20,
                      93,
                      156,
                    ), // 가독성을 위한 진한 네이비 톤
                    letterSpacing: 0.8, // 자간을 살짝 넓혀서 깔끔하게 배치했습니다.
                  ),
                ),
                const SizedBox(height: 8),

                // 2. Class Peek 로고 (C, P 포인트 컬러 + Outfit 서체 적용)
                RichText(
                  text: TextSpan(
                    style: GoogleFonts.outfit(
                      fontSize: 48,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -1.0,
                    ),
                    children: [
                      // 대문자 C (진한 블루)
                      const TextSpan(
                        text: 'C',
                        style: TextStyle(color: Color(0xFF1F4068)),
                      ),
                      // 소문자 lass (조금 더 연한 스카이 블루 톤)
                      const TextSpan(
                        text: 'lass ',
                        style: TextStyle(
                          color: Color.fromARGB(255, 45, 95, 148),
                        ), // 진한 블루보다 부드럽고 연한 블루
                      ),
                      // 대문자 P (진한 블루)
                      const TextSpan(
                        text: 'P',
                        style: TextStyle(color: Color(0xFF1F4068)),
                      ),
                      // 소문자 eek (조금 더 연한 스카이 블루 톤)
                      const TextSpan(
                        text: 'eek',
                        style: TextStyle(
                          color: Color.fromARGB(255, 45, 95, 148),
                        ),
                      ),
                    ],
                  ),
                ),

                // 3. 안내 문구 상자
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    '지역 설정',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // 4. 단계별 지역 선택 드롭다운 메뉴 3개
                // [시/도 선택]
                DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    hintText: '시/도 선택',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  value: selectedSiDo,
                  items: siDoList.map((String val) {
                    return DropdownMenuItem<String>(
                      value: val,
                      child: Text(val),
                    );
                  }).toList(),
                  onChanged: (val) {
                    setState(() {
                      selectedSiDo = val;
                      selectedSiGunGu = null; // ✨ 시/도가 바뀌면 시/군/구 초기화!
                      selectedEupMyeonDong = null; // ✨ 시/도가 바뀌면 읍/면/동까지 싹 초기화!
                    });
                  },
                ),
                const SizedBox(height: 12),

                // [시/군/구 선택]
                DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    hintText: '시/군/구 선택',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  value: selectedSiGunGu,
                  // 💡 선택된 시/도(예: 경기도)가 cityMap에 존재할 때만 해당 시/군/구 목록을 띄웁니다.
                  items:
                      (selectedSiDo != null &&
                          cityMap.containsKey(selectedSiDo))
                      ? cityMap[selectedSiDo]!.map((String val) {
                          return DropdownMenuItem<String>(
                            value: val,
                            child: Text(val),
                          );
                        }).toList()
                      : null,
                  onChanged: selectedSiDo == null
                      ? null
                      : (val) {
                          setState(() {
                            selectedSiGunGu = val;
                            selectedEupMyeonDong =
                                null; // 시/군/구가 바뀌면 하위 동네는 초기화
                          });
                        },
                ),
                const SizedBox(height: 12),

                // [읍/면/동 선택]
                DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    hintText: '읍/면/동 선택',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  value: selectedEupMyeonDong,
                  // 💡 eupMyeonDongList 대신 우리가 만든 areaMap에서 데이터를 꺼내오도록 수정했습니다!
                  items:
                      (selectedSiGunGu != null &&
                          areaMap.containsKey(selectedSiGunGu))
                      ? areaMap[selectedSiGunGu]!.map((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList()
                      : null,
                  onChanged: selectedSiGunGu == null
                      ? null
                      : (value) {
                          setState(() {
                            selectedEupMyeonDong = value;
                          });
                        },
                ),
                const SizedBox(height: 40),

                // // 5. 시작하기 버튼 (3개 다 골라야 작동함) 전체 교체
                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1F4068),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      elevation: 0,
                    ),
                    // 1번 페이지의 버튼 onPressed 부분
                    onPressed:
                        (selectedSiDo != null &&
                            selectedSiGunGu != null &&
                            selectedEupMyeonDong != null)
                        ? () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => Screen2Category(
                                  siDo: selectedSiDo!, // 1번 페이지에서 선택한 값 전달
                                  siGunGu:
                                      selectedSiGunGu!, // 1번 페이지에서 선택한 값 전달
                                  eupMyeonDong:
                                      selectedEupMyeonDong!, // 1번 페이지에서 선택한 값 전달
                                ),
                              ),
                            );
                          }
                        : null,
                    child: const Text(
                      '검색', // 기존 텍스트 유지 혹은 '시작하기'
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 2번 화면: 카테고리 탐색 (Problem 색상 적용 예정)
// ==========================================
class Screen2Category extends StatelessWidget {
  // 1번 페이지에서 넘겨줄 데이터를 저장할 변수들
  final String siDo;
  final String siGunGu;
  final String eupMyeonDong;

  // 데이터를 필수로 받도록 생성자 정의
  const Screen2Category({
    Key? key,
    required this.siDo,
    required this.siGunGu,
    required this.eupMyeonDong,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<String> categories = [
      '입시/교과',
      '예체능',
      '운동/피트니스',
      '취업/자격증',
      '기타(취미, 자기계발  등)',
    ];

    return Scaffold(
      appBar: AppBar(
        // 상단에 전달받은 지역 정보를 표시
        title: Text(
          '[$siDo $siGunGu $eupMyeonDong]',
          style: const TextStyle(fontSize: 16, color: Colors.black),
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '당신의 성장을 위한 공간을 찾아보세요',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.5,
                ),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  return Card(
                    color: Colors.grey[100],
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                Screen3List(categoryName: categories[index]),
                          ),
                        );
                      },
                      child: Center(
                        child: Text(
                          categories[index],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 3번 화면: 학원 리스트 화면
// ==========================================
class Screen3List extends StatelessWidget {
  final String categoryName;
  const Screen3List({super.key, required this.categoryName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('$categoryName 목록'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(40),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              TextButton(onPressed: () {}, child: const Text('거리순')),
              TextButton(onPressed: () {}, child: const Text('후기 많은 순')),
              TextButton(onPressed: () {}, child: const Text('가격 낮은 순')),
            ],
          ),
        ),
      ),
      body: ListView.builder(
        itemCount: 3,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.all(10),
            child: ListTile(
              leading: Container(
                width: 60,
                height: 60,
                color: Colors.grey[300],
                child: const Icon(Icons.image),
              ),
              title: Text('대박 $categoryName 학원 ${index + 1}호점'),
              subtitle: const Text('친절한 강사진과 쾌적한 환경! ⭐ 4.9 (후기 24개) · 1.2km'),
              trailing: const Icon(Icons.arrow_forward_ios, size: 16),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const Screen4Detail(),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

// ==========================================
// 4번 화면: 학원 상세 정보 화면
// ==========================================
class Screen4Detail extends StatelessWidget {
  const Screen4Detail({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('학원 상세 정보')),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            height: 200,
            color: Colors.grey[300],
            child: const Center(child: Text('[ 학원 대표 사진 슬라이드 영역 ]')),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: const [
                Text('[홈/소개]', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('[커리큘럼/가격]'),
                Text('[위치/지도]'),
                Text('[리뷰]'),
              ],
            ),
          ),
          const Divider(),
          const Expanded(child: Center(child: Text('여기에 학원의 상세한 설명글이 들어갑니다.'))),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('전화 문의하기'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const Screen5Reservation(),
                        ),
                      );
                    },
                    child: const Text('상담 예약하기'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// 5번 화면: 문의 및 예약 완료 화면
// ==========================================
class Screen5Reservation extends StatelessWidget {
  const Screen5Reservation({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('상담 예약하기')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '예약자 정보를 입력해 주세요.',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            const TextField(
              decoration: InputDecoration(
                labelText: '이름',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 15),
            const TextField(
              decoration: InputDecoration(
                labelText: '연락처',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 15),
            const TextField(
              decoration: InputDecoration(
                labelText: '방문 희망 날짜 및 시간',
                border: OutlineInputBorder(),
                hintText: '예시) 7월 20일 오후 2시',
              ),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('예약 완료'),
                      content: const Text(
                        '예약이 완료되었습니다!\n학원에서 확인 후 연락드릴 예정입니다.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                            Navigator.of(context).pop();
                            Navigator.of(context).pop();
                          },
                          child: const Text('확인'),
                        ),
                      ],
                    ),
                  );
                },
                child: const Text('예약 확정하기'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
