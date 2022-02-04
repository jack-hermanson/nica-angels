SELECT COUNT(*) FROM enrollment
INNER JOIN student ON enrollment.studentId = student.id
WHERE student.level = 8
AND enrollment.schoolId = 1;