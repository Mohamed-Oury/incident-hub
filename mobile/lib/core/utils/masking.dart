/// Utilitaire de masquage sécurisé des données sensibles (Conformité PCI-DSS)
class MaskingUtils {
  /// Masque un numéro de carte bancaire (PAN) selon la norme PCI-DSS : 6 premiers et 4 derniers visibles
  /// Exemple: 4970101234567890 -> 497010******7890
  static String maskPan(String? pan) {
    if (pan == null || pan.isEmpty) return '';
    final clean = pan.replaceAll(RegExp(r'[\s\-_]'), '');
    if (clean.length < 10) return clean;
    final first6 = clean.substring(0, 6);
    final last4 = clean.substring(clean.length - 4);
    final maskedLength = clean.length - 10;
    final stars = '*' * (maskedLength > 0 ? maskedLength : 6);
    return '$first6$stars$last4';
  }

  /// Masque un cryptogramme ou clé sensible
  static String maskKey(String? key) {
    if (key == null || key.length <= 8) return '********';
    return '${key.substring(0, 4)}****${key.substring(key.length - 4)}';
  }
}
