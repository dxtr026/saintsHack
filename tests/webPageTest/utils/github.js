require('../initializers')
config = require('../config')
const axios = require('axios')
const webPageTests = require('./webPageTest')
const awsUtil = require('./aws')
const processDataUtil = require('./webPageTest/processTestData')
const comments = require('./comments')

function executeTests () {
  var pull_request = process.env.BUILD_NUMBER
  if (!pull_request) {
    console.log('Could not find Build Number')
    return
  }
  var job_url = config.jenkins_job_url
  if (!job_url) {
    console.log('jenkins job url not specified')
    return
  }

  const url = job_url + '/' + pull_request + '/api/json'
  axios.get(url)
    .then(function (data) {
      const Pr_url = data.data.actions[1].causes[0].note
      const pr_number = Pr_url.split('/')[Pr_url.split('/').length - 1]
      console.log('PR Number', pr_number)
      const pr = githubApp.issues(pr_number)
      if (isNaN(parseInt(pr_number,10))) {
        console.log('Printing command line')
        return new Promise(function (resolve, reject) {
          webPageTests.initTests().then(function (response) {
            processDataUtil.processTestData(response)
              .then(function (structuredData) {
                comments.createInPlace(structuredData).then(function (body) {
                  console.log('\n---------------->>>>>>>>>>>>\n')
                  console.log(body)
                  console.log('\n---------------->>>>>>>>>>>>\n')
                  return resolve()
                }).catch(function (err) {
                  console.log('err', err)
                  return reject()
                })
              }).catch(function (err) {
              console.log('err', err)
              return reject()
            })
          }).catch(function (err) {
            console.log('err', err)
            return reject()
          })
        })
      }else {
        console.log('Commenting on PR')
        return new Promise(function (resolve, reject) {
          pr.comments.create({body: 'Test Started'})
            .then(function (commentNumber) {
              pr.labels.remove(['Run Tests'], function () {
                pr.labels.create(['Tests Running'])
              })
              webPageTests.initTests().then(function (response) {
                // repsonse is the object of all urls and test results
                // process data here
                console.log('will start processing')
                processDataUtil.processTestData(response)
                  .then(function (structuredData) {
                    comments.create(structuredData).then(function (body) {
                      githubApp.issues.comments(commentNumber.id)
                        .update({body: body}, function (err, data) {
                          console.log('commented ')
                          pr.labels.remove(['Tests Running'], function () {
                            pr.labels.create(['Tests Completed'])
                            return resolve()
                          })
                        })
                    }).catch(function (err) {
                      console.log('err', err)
                      return reject()
                    })
                  }).catch(function (err) {
                  console.log('err', err)
                  return reject()
                })
              }).catch(function (err) {
                console.log('err', err)
                return reject()
              })
            }).catch(function (err) {
            console.log('err', err)
            return reject()
          })
        })
      }
    }).catch(function (err) {
    console.log('err No PR Number Found', err)
    return
  })
}

executeTests()
