const redis = require('redis');
const Reviews = require('../Models/ReviewModel');
const Students = require('../Models/StudentModel');
const Companies = require('../Models/CompanyModel');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_CLIENT);

client.on('connect', () => {
  console.error('Connected to Redis');
});

client.on('error', (error) => {
  console.error(error);
});

const options = {
  useFindAndModify: false,
  new: true,
};

function addReview(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const date = new Date(jsonDate);
  const newReview = new Reviews({
    cname: data.cname,
    cid: data.cid,
    overallRating: data.overallRating,
    rheadline: data.rheadline,
    rdescription: data.rdescription,
    rpros: data.rpros,
    rcons: data.rcons,
    radvice: data.radvice,
    rrecommended: data.rrecommended,
    routlook: data.routlook,
    rceoapprove: data.rceoapprove,
    rhelpful: data.rhelpful,
    rstudent: {
      stid: data.stid,
      stname: data.stname,
    },
    rdate: date,
  });
  Students.findById(data.stid, (error, student) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Student id does not exist',
      };
      callback(null, response);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      student.streviews.push({
        cname: data.cname,
        cid: data.cid,
        overallRating: data.overallRating,
        rheadline: data.rheadline,
        rdescription: data.rdescription,
        rpros: data.rpros,
        rcons: data.rcons,
        radvice: data.radvice,
        rrecommended: data.rrecommended,
        routlook: data.routlook,
        rceoapprove: data.rceoapprove,
        rhelpful: data.rhelpful,
        rdate: date,
      });
      student.save((err) => {
        if (err) {
          const response = {
            status: 401,
            header: 'text/plain',
            content: 'Error modifying student',
          };
          callback(null, response);
        } else {
          newReview.save((e, review) => {
            if (e) {
              const response = {
                status: 401,
                header: 'text/plain',
                content: 'Error saving review',
              };
              callback(null, response);
            } else {
              const response = {
                status: 200,
                header: 'application/json',
                content: JSON.stringify(review),
              };
              callback(null, response);
            }
          });
        }
      });
    }
  });
}

function getByCompanyName(data, callback) {
  if (data.skip === undefined) {
    data.skip = 0;
  }
  // if (data.limit === undefined) {
  //   data.limit = 10;
  // }
  data.limit = 5;
  console.log('Req Body: ', data);
  const redisKey = `${data.cname}_Reviews_${data.skip}`;
  client.set('test', 'foobar', (error, response) => {
    if (error) {
      console.log('==> could not save to redis', error);
    } else {
      console.log('==> ', response);
    }
  });

  client.get(redisKey, (err, reply) => {
    if (err) {
      console.log(err);
    }
    if (reply !== null) {
      // Response exists inn the cache
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.parse(JSON.stringify(reply)),
      };
      console.log('Sending 200 from Redis');
      callback(null, response);
    } else {
      // Response not in cache--fetch from mongo
      Reviews.find({ cname: data.cname })
        .skip(data.skip * data.limit)
        .limit(data.limit)
        .exec((error, reviews) => {
          if (error) {
            const response = {
              status: 401,
              header: 'text/plain',
              content: 'Error fetching reviews',
            };
            callback(null, response);
          } else {
            const redisValue = JSON.stringify(reviews);
            client.set(redisKey, redisValue, (e, r) => {
              if (e) {
                console.log(e);
              } else {
                console.log('Cache successful: ', r);
              }
            });
            console.log('Sending 200 from Mongo');
            const response = {
              status: 200,
              header: 'application/json',
              content: JSON.stringify(reviews),
            };
            callback(null, response);
          }
        });
    }
  });
}

function getByCompanyId(data, callback) {
  Reviews.find({ cid: data.cid , rapproval: "Approved"}, (error, reviews) => {
    if (error) {
      console.log(error);
      return callback(error, null);
    }

    return callback(null, reviews);
  });
}

function updateReview(data, callback) {
  const updateStatus = {
    rreply: data.rreply,
  };

  const { id, ...updateInfo } = data;
  console.log('update info spread operator', data.rreply);
  Reviews.updateOne(
    { _id: data.rreplyid },
    { $set: updateStatus },
    options,
    (error, results) => {
      console.log('Inside Find by ID reply: ', results);
      if (error) {
        const response = {
          status: 401,
          header: 'text/plain',
          content: 'Error updating Reviews reply',
        };
        callback(null, response);
      } else {
        const response = {
          status: 200,
          header: 'application/json',
          content: JSON.stringify(results),
        };
        console.log('response content reply: ', response.content);
        callback(null, response);
      }
    },
  );
}

function getFeatReview(data, callback) {
  Reviews.findById(data.rid, (error, job) => {
    console.log('Kafka backend feat review: ', job);
    console.log('kafka backend data: ', data);
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
      console.log('kafka be f etareview response: ', response.content);
      callback(null, response);
    }
  });
}
function incrementHelpfulReview(data, callback) {
  Reviews.findByIdAndUpdate(data.rid, { $inc: { rhelpful: 1 } }, { new: true }, (error, review) => {
    if (error) {
      const response = {
        status: 401,
        header: 'text/plain',
        content: 'Error helpful review',
      };
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(review),
      };
      callback(null, response);
    }
  });
}
function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'ADDREVIEW': {
      console.log('KB: Inside add review');
      console.log('Message:', msg);
      addReview(msg.data, callback);
      break;
    }
    case 'GETREVIEWBYCNAME': {
      console.log('KB: Inside get review by company name');
      console.log('Message:', msg);
      getByCompanyName(msg.data, callback);
      break;
    }
    case 'GETREVIEWBYCID': {
      console.log('KB: Inside get review by company name');
      console.log('Message:', msg);
      getByCompanyId(msg.data, callback);
      break;
    }

    case 'REPLYTOREVIEW': {
      console.log('KB: Inside Reply to review');
      console.log('Message:', msg);
      updateReview(msg.data, callback);
      break;
    }

    case 'GETFEATREVIEWS': {
      console.log('KB: Inside Reply to review');
      console.log('Message:', msg);
      getFeatReview(msg.data, callback);
      break;
    }

    case 'HELPFULREVIEW': {
      console.log('KB: Inside helpful review');
      console.log('Message:', msg);
      incrementHelpfulReview(msg.data, callback);
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
