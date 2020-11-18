const Jobs = require('../Models/JobModel');

function getAllJobs(data, callback) {
  Jobs.find({}, (error, jobs) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Error fetching jobs',
      };
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(jobs),
      };
      callback(null, response);
    }
  });
}

function getOneJob(data, callback) {
  Jobs.findById(data.id, (error, job) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Error fetching jobs',
      };
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(job),
      };
      callback(null, response);
    }
  });
}

function addNewJob(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const posted = new Date(jsonDate);

  const newJob = new Jobs({
    cname: data.cname,
    jtitle: data.jtitle,
    jindustry: data.jindustry,
    jcity: data.jcity,
    jstate: data.jstate,
    jcountry: data.jcountry,
    jzip: data.jzip,
    jaddress: data.jaddress,
    jlatitude: data.jlatitiude,
    jlongitude: data.jlongitude,
    jwork: data.jwork,
    jposted: posted,
    jpostedBy: data.jpostedBy,
    jdescription: data.jdescription,
    jresponsibilities: data.jresponsibilities,
    jqualifications: data.jqualifications,
  });

  newJob.save((error, job) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Error saving job',
      };
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(job),
      };
      callback(null, response);
    }
  });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'GETALL': {
      console.log('KB: Inside get all jobs');
      console.log('Message:', msg);
      getAllJobs(msg.data, callback);
      break;
    }

    case 'GETONE': {
      console.log('KB: Inside get one job');
      console.log('Message:', msg);
      getOneJob(msg.data, callback);
      break;
    }

    case 'ADDNEWJOB': {
      console.log('KB: Inside get one job');
      console.log('Message:', msg);
      addNewJob(msg.data, callback);
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
