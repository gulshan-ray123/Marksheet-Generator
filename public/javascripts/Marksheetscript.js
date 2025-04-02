let subjectCount = 1;

function addSubject() {
    subjectCount++;
    const subjectsDiv = document.getElementById('subjects');
    const newSubject = document.createElement('div');
    newSubject.className = 'subject';
    newSubject.innerHTML = `
        <label for="subjectName${subjectCount}">Subject Name:</label>
        <input type="text" id="subjectName${subjectCount}" name="subjects[${subjectCount - 1}][subjectName]" required>

        <label for="theoryMarks${subjectCount}">Theory Marks:</label>
        <input type="number" id="theoryMarks${subjectCount}" name="subjects[${subjectCount - 1}][theoryMarks]" required>

        <label for="practicalMarks${subjectCount}">Practical Marks:</label>
        <input type="number" id="practicalMarks${subjectCount}" name="subjects[${subjectCount - 1}][practicalMarks]" required><br><br>
    `;
    subjectsDiv.appendChild(newSubject);
}