const fs = require('fs');
const path = require('path');


const getStudentData = () => {
    const fileName = path.resolve(__dirname, 'data', 'students.json');

    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            }
            catch (e) {
                reject(e);
            }
        });
    });
};


const exo02 = async () => {
    const data = await getStudentData();

    // const avgSections = getAvgSections1(data);
    const avgSections = getAvgSections2(data);
    console.log(avgSections);

};
exo02();


const getAvgSections1 = (data) => {
    const averageSections = [];

    for (const { section, students } of data.results) {

        let sum = 0;
        let nbStudent = 0;
        students.forEach(student => {
            if (student.year_result !== null) {
                sum += student.year_result;
                nbStudent++;
            }
        });

        averageSections.push({
            section: `${section.code} - ${section.name}`,
            average: Math.round((sum / nbStudent) * 100) / 100
        });
    }

    return averageSections;
};


const getAvgSections2 = (data) => {
    const averageSections = [];

    data.results.forEach(result => {

        const studentResults = result.students
            .filter(s => s.year_result !== null)
            .map(s => s.year_result);
        // console.log(studentResults);

        const sum = studentResults.reduce((total, current) => total + current, 0);
        // console.log(sum);

        averageSections.push({
            section: `${result.section.code} - ${result.section.name}`,
            average: Math.round((sum / studentResults.length) * 100) / 100
        });
    });

    return averageSections;
};