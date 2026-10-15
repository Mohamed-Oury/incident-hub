import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../data/flexcube_data.dart';
import 'flexcube_exam_screen.dart';

class FlexcubeTrainingScreen extends StatefulWidget {
  const FlexcubeTrainingScreen({super.key});

  @override
  State<FlexcubeTrainingScreen> createState() => _FlexcubeTrainingScreenState();
}

class _FlexcubeTrainingScreenState extends State<FlexcubeTrainingScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  static const Color flexcubeOrange = Color(0xFFEA580C);
  static const Color flexcubeOrangeLight = Color(0xFFFB923C);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cursus & Certification FCUBS'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: flexcubeOrange,
          labelColor: flexcubeOrangeLight,
          unselectedLabelColor: AppTheme.textSecondary,
          labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Grades & Qualification (5)'),
            Tab(text: 'Leçons Techniques (15)'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildGradesTab(),
          _buildLessonsTab(),
        ],
      ),
    );
  }

  Widget _buildGradesTab() {
    final grades = FlexcubeData.grades;

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: grades.length,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        final g = grades[index];

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppTheme.borderDark),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(g.badge, style: const TextStyle(fontSize: 22)),
                      const SizedBox(width: 8),
                      Text(
                        'GRADE ${g.level} • ${g.gradeCode}',
                        style: const TextStyle(color: flexcubeOrangeLight, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.successGreen.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppTheme.successGreen.withValues(alpha: 0.4)),
                    ),
                    child: Text(
                      'Requis : ${g.minPassScorePct}%',
                      style: const TextStyle(color: AppTheme.successGreen, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                g.name,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
              const SizedBox(height: 6),
              Text(
                g.objective,
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, height: 1.3),
              ),
              const SizedBox(height: 12),
              const Text(
                'Documentation & Référentiels Officiels :',
                style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              ...g.recommendedResources.map((r) => Padding(
                padding: const EdgeInsets.only(bottom: 3),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.menu_book, color: flexcubeOrangeLight, size: 13),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        '${r.title} (${r.reference})',
                        style: const TextStyle(color: Colors.white60, fontSize: 11),
                      ),
                    ),
                  ],
                ),
              )),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: flexcubeOrange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => FlexcubeExamScreen(initialGradeLevel: g.level),
                      ),
                    );
                  },
                  icon: const Icon(Icons.school, size: 16),
                  label: Text('Passer l\'Examen Grade ${g.level} (15 QCM)'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLessonsTab() {
    final lessons = FlexcubeData.lessons;

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: lessons.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final l = lessons[index];

        return ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          collapsedBackgroundColor: AppTheme.darkCard,
          backgroundColor: AppTheme.darkCard,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: AppTheme.borderDark),
          ),
          collapsedShape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: AppTheme.borderDark),
          ),
          leading: Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: flexcubeOrange.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                'G${l.gradeLevel}',
                style: const TextStyle(color: flexcubeOrangeLight, fontWeight: FontWeight.bold, fontSize: 11),
              ),
            ),
          ),
          title: Text(
            l.title,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
          ),
          subtitle: Text(
            'Module ${l.module} • ${l.durationMinutes} min',
            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Divider(color: AppTheme.borderDark),
                  Text(l.overview, style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.3)),
                  const SizedBox(height: 10),
                  const Text('Points Clés à Retenir :', style: TextStyle(color: flexcubeOrangeLight, fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  ...l.keyTakeaways.map((k) => Padding(
                    padding: const EdgeInsets.only(bottom: 2),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.check, color: AppTheme.successGreen, size: 14),
                        const SizedBox(width: 6),
                        Expanded(child: Text(k, style: const TextStyle(color: Colors.white70, fontSize: 11))),
                      ],
                    ),
                  )),
                  const SizedBox(height: 10),
                  Container(
                    height: 140,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.black45,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: SingleChildScrollView(
                      child: Text(
                        l.contentMarkdown,
                        style: const TextStyle(color: Colors.white70, fontSize: 11, height: 1.3),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
