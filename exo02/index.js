const fs = require('fs');
const path = require('path');
const _ = require('lodash');


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

    const avgSections = getAvgSections3(data);
    console.log(avgSections);

    const avgGlobal = getAvgResult2(data);
    console.log(avgGlobal);

    const profs = getProfs2(data);
    console.log(profs);

    const students = getStudents(data);
    console.log(students);
};
exo02();

const getStudents = (data) => {

    const students = data.results
        .map(r => r.students)
        .flat()
        .map(s => ({ firstname: s.firstname, lastname: s.lastname }));
    // //  .map(({ firstname, lastname }) => ({ firstname, lastname }));

    // return students;
};


const getProfs1 = (data) => {
    let profs = [];

    for (const result of data.results) {
        profs = [...profs, result.professor];
    }

    return profs;
};

const getProfs2 = (data) => data.results.map(r => r.professor);


const getAvgResult1 = (data) => {
    const students = data.results
        .map(r => r.students)
        .flat()
        .filter(s => s.year_result != null);

    const sum = students.reduce((acc, student) => acc + student.year_result, 0);
    const avg = (Math.round(sum * 100 / students.length) / 100);
    return avg;
};

const getAvgResult2 = (data) => {
    const students = data.results
        .map(r => r.students)
        .flat()
        .filter(s => s.year_result != null);

    return _.round(_.meanBy(students, 'year_result'), 2);
};


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

const getAvgSections3 = (data) => {
    return data.results.reduce((avgs, result) => {
        const section = `${result.section.code} - ${result.section.name}`;
        const students = _.filter(result.students, s => s.year_result != null);
        const average = _.round(_.meanBy(students, s => s.year_result), 2);

        return [...avgs, { section, average }];
        // return avgs.concat({ section, average });
    }, []);
};