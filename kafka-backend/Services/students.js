const Students = require('../Models/StudentModel');

function getAllStudents(data, callback) {
  Students.find({}, (error, students) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Error fetching students',
      };
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(students),
      };
      callback(null, response);
    }
  });
}

function getStudentById(data, callback) {
  Students.findById(data.id, (error, student) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Error fetching student',
      };
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(student),
      };
      callback(null, response);
    }
  });
}

function handleRequest(msg, callback) {
  console.log('=>', msg.subTopic);
  switch (msg.subTopic) {
    case 'GETALL': {
      console.log('KB: Inside get all students');
      console.log('Message:', msg);
      getAllStudents(msg.data, callback);
      break;
    }

    case 'GETONE': {
      console.log('KB: Inside student by id');
      console.log('Message:', msg);
      getStudentById(msg.data, callback);
      break;
    }

    default: {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Bad request',
      };
      callback(null, response);
    }
  }
}

exports.handleRequest = handleRequest;