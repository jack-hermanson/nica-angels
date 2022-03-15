SELECT 
    sponsorship.id,
    sponsorship.startDate,
    sponsorship.endDate,
    sponsorship.studentId,
    sponsorship.sponsorId,
    sponsorship.frequency,
    sponsorship.payment,
    sponsorship.created,
    sponsorship.updated,
    sponsorship.deleted,
    student.firstName as student_firstName,
    student.middleName as student_middleName,
    student.lastName as student_lastName,
    sponsor.firstName as sponsor_firstName,
    sponsor.lastName as sponsor_lastName
FROM 
    sponsorship
INNER JOIN
    student
ON 
    student.id = sponsorship.studentId
INNER JOIN
    sponsor
ON 
    sponsor.id = sponsorship.sponsorId
WHERE 
    (sponsorship.endDate IS NULL
AND 
    sponsorship.deleted IS NULL)
ORDER BY student_firstName DESC;