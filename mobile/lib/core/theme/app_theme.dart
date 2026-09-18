import 'package:flutter/material.dart';

class AppTheme {
  // Charte Officielle GROUPE SOCIÉTÉ GÉNÉRALE : Rouge SG (#E60028), Noir profond (#111827 / #1A1A1A), Blanc
  static const Color sgRed = Color(0xFFE60028);        // Rouge officiel Société Générale
  static const Color sgRedDark = Color(0xFFCC0024);
  static const Color sgRedSubtle = Color(0x33E60028);  // 20% alpha

  static const Color darkBg = Color(0xFF111827);       // Noir profond officiel SG
  static const Color darkSurface = Color(0xFF1A1A1A);  // Noir secondaire SG
  static const Color darkCard = Color(0xFF1F2937);     // Ardoise sombre pour cartes
  static const Color borderDark = Color(0xFF374151);   // Bordures

  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color textMuted = Color(0xFF6B7280);

  // Status colors
  static const Color successGreen = Color(0xFF10B981);
  static const Color warningOrange = Color(0xFFF59E0B);
  static const Color errorRed = Color(0xFFE60028);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBg,
      primaryColor: sgRed,
      colorScheme: const ColorScheme.dark(
        primary: sgRed,
        secondary: sgRedDark,
        surface: darkSurface,
        error: errorRed,
      ),
      cardTheme: CardTheme(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: borderDark, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
        ),
        iconTheme: IconThemeData(color: Colors.white),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkSurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: borderDark),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: borderDark),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: sgRed, width: 1.5),
        ),
        hintStyle: const TextStyle(color: textMuted, fontSize: 14),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: darkSurface,
        side: const BorderSide(color: borderDark),
        labelStyle: const TextStyle(fontSize: 12, color: Colors.white),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
