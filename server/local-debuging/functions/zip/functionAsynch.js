const nano = require('nano')('https://50c7e1e9-f42d-4571-8264-6db36cec19e6-bluemix:96b969836e91f94661cba0fbc9e4fa38e0984cc16de8818e23d87af1ff91c482@50c7e1e9-f42d-4571-8264-6db36cec19e6-bluemix.cloudant.com');
// const nano = require('nano')('https://thertitorthessomenothede:261545e228eed9a180d1f958292214c23b683b22@50c7e1e9-f42d-4571-8264-6db36cec19e6-bluemix.cloudant.com');
const device_updates = nano.db.use('device_updates');
const clockedin_list = nano.db.use('clockedin_list');



async function main(params) {
//   const {
//     location = 'Vermont',
//   } = params;
  console.log(params.__ow_body)
  params = params.__ow_body[0]

var onlinelist = await clockedin_list.list({include_docs: true}).then((body) => {
    var array = new Array()
body.rows.forEach((doc) => {
    // output eacj document's body

    if(doc.doc.deviceId == params.deviceId){
        array.push(doc.doc)
    }
  });
  return array  
})
params.userList = onlinelist

const insertObject = async function(params) {
    return  device_updates.insert(params).then((body) => {
        console.log(body);        
        return body
        });
  }

var created = await insertObject(params)

return created

}
exports.main = main;