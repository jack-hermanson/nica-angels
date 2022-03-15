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
    student.firstName,
    student.middleName,
    student.lastName,
    sponsor.firstName,
    sponsor.lastName
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
    sponsorship.endDate IS NULL;
